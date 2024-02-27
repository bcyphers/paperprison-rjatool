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
  query += ` AND offense in (${"?,".repeat(offenses.length - 1) + "?"})`;
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

  let chart = {};
  for (const r of rows) {
    if (!(r.offense in chart)) {
      chart[r.offense] = {};
    }

    if (!(r.year in chart)) {
      chart[r.offense][r.year] = {};
    }

    if (!(r.race in chart[r.year])) {
      chart[r.offense][r.year][r.race] = r;
    }
  }

  for (const [off, v1] of Object.entries(chart)) {
    for (const [year, v2] of Object.entries(v1)) {
      for (dp of decisions) {

      }
    }
  }

  // aggregate years

  // aggregate offenses


  console.log("Returning!");
  res.status(200).json({raw: rows, chart: chart});
}
