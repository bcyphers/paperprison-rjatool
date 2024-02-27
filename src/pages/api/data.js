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
    let pop = r.pop;
    if (r.year === 'All') {
      pop *= 11.75;
    } else if (r.year === '2021') {
      pop *= 0.75;
    }

    if (!(r.race in data)) {
      data[r.race] = {};
    }

    if (!(r.decision in data[r.race])) {
      data[r.race][r.decision] = {num: 0, pop: 0, num_w: 0, pop_w: 0};
    }

    if (ALLOW_NA) {
      // if we're treating NANs like zeroes, just skip over this data point
      if (measurement == 'disparity_gap_pop_w') {
        if (isNaN(r.number_white)) {
          continue;
        }
        data[r.race][r.decision].num_w += r.number_white;
        data[r.race][r.decision].pop_w += r.pop_white;
      }

      if (isNaN(r.number)) {
        continue;
      }
      data[r.race][r.decision].num += r.number;
      data[r.race][r.decision].pop += r.pop;
    } else {
      // if one NAN is too many, just allow it to poison the value
      data[r.race][r.decision].num += r.number;
      data[r.race][r.decision].pop += r.pop;

      if (measurement == 'disparity_gap_pop_w') {
        data[r.race][r.decision].num_w += r.number_white;
        data[r.race][r.decision].pop_w += r.pop_white;
      }
    }
  }

  console.log(data);

  let out = {};
  for (const [r, v1] of Object.entries(data)) {
    console.log(v1);
    out[r] = {};
    for (const [d, v2] of Object.entries(v1)) {
      if (measurement === "number") {
        out[r][d] = v2.num;
      } else if (measurement === "rate_per_pop") {
        out[r][d] = v2.num / v2.pop;
      } else if (measurement === "disparity_gap_pop_w") {
        out[r][d] = (v2.num / v2.pop) / (v2.num_w / v2.pop_w);
      }
    }
  }

  console.log("Returning!");
  res.status(200).json({raw: rows, chart: out});
}
