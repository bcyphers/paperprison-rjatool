const http = require("http"),
      url = require("url"),
      sqlite3 = require("sqlite3").verbose(),
      sqlite = require("sqlite");

const filepath = "./rja.db";

const ALLOW_NA = true;

const MEASUREMENT_MAP = {
  "Raw numbers": "number",
  "Rate per population": "rate_per_pop",
  //"Rate per prior event point": "rate_cond_previous",
  "Disparity gap per population": "disparity_gap_pop_w",
  //"Disparity gap per prior event point": "disparity_gap_cond_w",
};

const DEFAULTS = {
  county: "All Counties",
  years: ["All Years"],
  offenses: ["459 PC-BURGLARY"],
  measurement: "number",
};

export default async function handler(req, res) {
  const db = await sqlite.open({
    filename: filepath,
    driver: sqlite3.Database,
  });

  console.log("DB connection established");
  console.log(req.body);
  const body = JSON.parse(req.body);

  const county = ('county' in body ? body.county : DEFAULTS.county);
  let query = "SELECT * FROM data WHERE county = ?";
  let vars = [county];

  const offenses = ('offenses' in body ? body.offenses : DEFAULTS.offenses);
  query += ` AND PC_offense in (${"?,".repeat(offenses.length - 1) + "?"})`;
  vars.push(...offenses);

  const years = ('years' in body ? body.years : DEFAULTS.year);
  query += ` AND year in (${"?,".repeat(years.length - 1) + "?"})`;
  vars.push(...years);

  if ('races' in body) {
    const races = body.races;
    query += ` AND race in (${"?,".repeat(races.length - 1) + "?"})`;
    vars.push(...races);
  }

  if ('decisionPoints' in body) {
    const decisions = body.decisionPoints;
    query += ` AND decision in (${"?,".repeat(decisions.length - 1) + "?"})`;
    vars.push(...decisions);
  }

  query += ";";

  const measurement = ('measurement' in body ?
    MEASUREMENT_MAP[body.measurement] : DEFAULTS.measurement);

  const rows = await db.all(query, vars);

  let data = {};
  for (const r of rows) {
    if (!(r.race in data)) {
      data[r.race] = {};
    }

    if (!(r.decision in data[r.race])) {
      data[r.race][r.decision] = {};
    }

    if (!(r.year in data[r.race][r.decision])) {
      let pop_mult = 1;
      if (r.year === 'All Years') {
        pop_mult *= 11.75;
      } else if (r.year === '2021') {
        pop_mult *= 0.75;
      }

      data[r.race][r.decision][r.year] = {
        num: 0,
        pop: r.pop * pop_mult,
        num_w: 0,
        pop_w: r.pop_white * pop_mult,
      };
    }

    data[r.race][r.decision][r.year].num += r.number;

    if (measurement == 'disparity_gap_pop_w') {
      data[r.race][r.decision][r.year].num_w += r.number_white;
    }
  }

  let out = {};
  for (const [r, race_data] of Object.entries(data)) {
    out[r] = {};
    for (const [d, decision_data] of Object.entries(race_data)) {
      let agg = {num: 0, pop: 0, num_w: 0, pop_w: 0};

      for (const [y, year_data] of Object.entries(decision_data)) {
        agg.num += year_data.num;
        agg.num_w += year_data.num_w;
        agg.pop += year_data.pop;
        agg.pop_w += year_data.pop_w;
      }

      if (measurement === "number") {
        out[r][d] = agg.num;
      } else if (measurement === "rate_per_pop") {
        out[r][d] = agg.num / agg.pop;
      } else if (measurement === "disparity_gap_pop_w") {
        out[r][d] = (agg.num / agg.pop) / (agg.num_w / agg.pop_w);
      }
    }
  }

  res.status(200).json({raw: rows, chart: out});
}
