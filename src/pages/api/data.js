const http = require("http"),
      url = require("url"),
      ini = require("ini"),
      fs = require("fs"),
      util = require("util"),
      mysql = require("mysql");

const ALLOW_NA = true;

const MEASUREMENTS = {
  RAW: "number",
  RATE: "rate_per_pop",
  DG: "disparity_gap_pop_w",
  //R_PEP: "rate_cond_previous",
  //DG_PEP: "disparity_gap_cond_w",
};

const DEFAULTS = {
  counties: ["All Counties"],
  years: ["All Years"],
  offenses: ["459 PC-BURGLARY"],
  measurement: MEASUREMENTS.RAW,
};

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

export default async function handler(req, res) {
  const con = await mysql.createConnection({
    host: config.mysqlDB.host,
    user: config.mysqlDB.user,
    password: config.mysqlDB.pass,
    database: config.mysqlDB.db,
  });

  console.log("API request at " + new Date(Date.now()));
  console.log(req.body);
  const body = JSON.parse(req.body);

  const counties = ('counties' in body ? body.counties : DEFAULTS.counties);
  let query = `SELECT * FROM data WHERE county in (${"?,".repeat(counties.length - 1) + "?"})`;
  let vars = [...counties];

  const offenses = ('offenses' in body ? body.offenses : DEFAULTS.offenses);
  if (offenses[0] !== "All Offenses") {
    query += ` AND offense_name in (${"?,".repeat(offenses.length - 1) + "?"})`;
    vars.push(...offenses);
  }

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
    MEASUREMENTS[body.measurement] : DEFAULTS.measurement);

  const doQuery = util.promisify(con.query).bind(con);
  const rows = await doQuery(query, vars);
  con.end();

  let data = {};
  for (const r of rows) {
    if (!(r.race in data)) {
      data[r.race] = {};
    }

    if (!(r.decision in data[r.race])) {
      data[r.race][r.decision] = {};
    }

    if (!(r.year in data[r.race][r.decision])) {
      data[r.race][r.decision][r.year] = {};
    }

    if (!(r.county in data[r.race][r.decision][r.year])) {
      let pop_mult = 1;
      if (r.year === 'All Years') {
        pop_mult *= 11.75;
      } else if (r.year === '2021') {
        pop_mult *= 0.75;
      }

      data[r.race][r.decision][r.year][r.county] = {
        num: 0,
        pop: r.pop * pop_mult,
        num_w: 0,
        pop_w: r.pop_white * pop_mult,
      };
    }

    data[r.race][r.decision][r.year][r.county].num += r.number;

    if (measurement == MEASUREMENTS.DG) {
      data[r.race][r.decision][r.year][r.county].num_w += r.number_white;
    }
  }

  let out = {};
  for (const [r, race_data] of Object.entries(data)) {
    out[r] = {};
    for (const [d, decision_data] of Object.entries(race_data)) {
      let agg = {num: 0, pop: 0, num_w: 0, pop_w: 0};

      for (const [y, year_data] of Object.entries(decision_data)) {
        for (const [c, cty_data] of Object.entries(year_data)) {
          agg.num += cty_data.num;
          agg.num_w += cty_data.num_w;
          agg.pop += cty_data.pop;
          agg.pop_w += cty_data.pop_w;
        }
      }

      if (measurement === MEASUREMENTS.RAW) {
        out[r][d] = agg.num;
      } else if (measurement === MEASUREMENTS.RATE) {
        out[r][d] = agg.num / agg.pop;
      } else if (measurement === MEASUREMENTS.DG) {
        out[r][d] = (agg.num / agg.pop) / (agg.num_w / agg.pop_w);
      }
    }
  }

  console.log("Returning " + rows.length + " rows.");
  res.status(200).json({raw: rows, chart: out});
}
