const http = require("http"),
      url = require("url"),
      sqlite3 = require("sqlite3").verbose(),
      sqlite = require("sqlite");

const filepath = "./rja.db";

export default async function handler(req, res) {
  const db = await sqlite.open({
    filename: filepath,
    driver: sqlite3.Database,
  });

  const columns = {
    counties: "county",
    years: "year",
    decisionPoints: "decision",
    offenses: "PC_offense",
    races: "race",
  }

  let out = {};

  for (const [key, col] of Object.entries(columns)) {
    const rows = await db.all(`SELECT DISTINCT ${col} FROM data;`);
    out[key] = rows.map((r) => r[col]);
  }

  res.status(200).json(out);
}
