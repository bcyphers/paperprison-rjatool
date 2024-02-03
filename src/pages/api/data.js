const http = require("http"),
      url = require("url"),
      sqlite3 = require("sqlite3").verbose(),
      sqlite = require("sqlite");

const filepath = "./rja.db";

const MEASUREMENT_MAP = {
  "Raw numbers": "number",
  "Rate per population": "rate_per_100_pop",
  "Rate per prior event point": "rate_cond_previous",
  "Disparity gap per population": "disparity_gap_pop_w",
  "Disparity gap per prior event point": "disparity_gap_cond_w",
};


const DEFAULTS = {
  county: "All Counties",
  years: ["All Years"],
  offense: "459 PC-BURGLARY",
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

  let query = "SELECT * FROM data WHERE county = ? AND PC_offense = ? ";
  const county = ('county' in body ? body.county : DEFAULTS.county);
  const offense = ('offense' in body ? body.offense : DEFAULTS.offense);
  const measurement = ('measurement' in body ?
    MEASUREMENT_MAP[body.measurement] : DEFAULTS.measurement);

  let vars = [county, offense];

  let years = ('years' in body ? body.years : DEFAULTS.year);
  query += ` AND year in (${"?,".repeat(years.length - 1) + "?"})`;
  vars.push(...years);

  if ('races' in body) {
    let races = body.races;
    query += ` AND race in (${"?,".repeat(races.length - 1) + "?"})`;
    vars.push(...races);
  }

  if ('decisionPoints' in body) {
    let decisions = body.decisionPoints;
    query += ` AND decision in (${"?,".repeat(decisions.length - 1) + "?"})`;
    vars.push(...decisions);
  }

  query += ";";

  const rows = await db.all(query, vars);

  let chart = {};
  for (const r of rows) {
    if (!(r.year in chart)) {
      chart[r.year] = {};
    }

    if (!(r.race in chart[r.year])) {
      chart[r.year][r.race] = {};
    }

    chart[r.year][r.race][r.decision] = r[measurement];
  }

  console.log("Returning!");
  res.status(200).json({raw: rows, chart: chart});
}
