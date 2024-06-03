const http = require("http"),
      url = require("url"),
      ini = require("ini"),
      fs = require("fs"),
      util = require("util"),
      mysql = require("mysql");

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

export default async function handler(req, res) {
  const con = await mysql.createConnection({
    host: config.mysqlDB.host,
    user: config.mysqlDB.user,
    password: config.mysqlDB.pass,
    database: config.mysqlDB.db,
  });

  const columns = {
    counties: "county",
    years: "year",
    decisionPoints: "decision",
    offenses: "offense_name",
    races: "race",
  }

  let out = {};

  const doQuery = util.promisify(con.query).bind(con);

  try {
    for (const [key, col] of Object.entries(columns)) {
      const rows = await doQuery(`SELECT DISTINCT ${col} FROM data;`);
      out[key] = rows.map((r) => r[col]);
    }
  } finally {
    con.end();
  }

  res.status(200).json(out);
}
