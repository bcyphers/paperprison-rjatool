import React, { useEffect, useState } from "react";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import ExcelJS from "exceljs";
import { IconChart, getYearsLabel } from "@/components/IconCharts";
import DataTable from "@/components/DataTable";
import PrivateSelect from "@/components/Select";
import Grid from "@/components/Grid";

export const MEASUREMENTS = {
  RAW: "Raw numbers",
  RATE: "Rate per unit population",
  DG: "Population disparity v. white",
  //R_PEP: "Rate per prior event point",
  //DG_PEP: "Disparity gap per prior event point",
};

export const DATA_COLUMNS = {
  county: "County",
  year: "Year",
  code: "Code Section",
  offense: "Offense",
  decision: "Event Point",
  race: "Race",
  //gender: "Gender",
  number: "Number",
  pop: "Population",
  rate_pop: "Rate per 1,000 population per year",
  dg_pop: MEASUREMENTS.DG,
};

const DATA_COLUMN_MAP = {
  "county": DATA_COLUMNS.county,
  "year": DATA_COLUMNS.year,
  "code_section": DATA_COLUMNS.code,
  "offense_name": DATA_COLUMNS.offense,
  "decision": DATA_COLUMNS.decision,
  "race": DATA_COLUMNS.race,
  //"gender": "Gender",
  "number": DATA_COLUMNS.number,
  "pop": DATA_COLUMNS.pop,
};

const RACES = {
  White: "White",
  Black: "Black",
  Hispanic: "Hispanic",
  AAPI: "Asian / Pacific Islander",
  "Native American": "Native American",
};

const DECISION_POINTS = [
  "Arrest",
  "Charge",
  "Conviction",
  "Felony conviction",
  "Incarceration",
  "Prison sentence",
];

const DEFAULTS = {
  years: ["All Years"],
  counties: ["All Counties"],
  decisionPoints: [...DECISION_POINTS],
  offenses: ["459 PC-BURGLARY"],
  races: Object.keys(RACES),
  measurement: MEASUREMENTS.RAW,
}

const getURLQueryParameterByName = (name, url = window.location.href) => {
  const sanitizedName = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp(`[?&]${sanitizedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  const [yearsAvailable, setYearsAvailable] = useState([]);
  const [countiesAvailable, setCountiesAvailable] = useState([]);
  const [offensesAvailable, setOffensesAvailable] = useState([]);
  const [decisionPointsAvailable, setDecisionPointsAvailable] = useState(DECISION_POINTS);
  const [racesAvailable, setRacesAvailable] = useState(Object.keys(RACES));
  //const [gendersAvailable, setGendersAvailable] = useState([]);

  const [years, setYears] = useState(DEFAULTS.years);
  const [counties, setCounties] = useState(DEFAULTS.counties);
  const [offenses, setOffenses] = useState(DEFAULTS.offenses);
  const [decisionPoints, setDecisionPoints] = useState(DEFAULTS.decisionPoints);
  const [races, setRaces] = useState(DEFAULTS.races);
  //const [genders, setGenders] = useState([]);
  const [measurement, setMeasurement] = useState(DEFAULTS.measurement);
  const [filteredRecords, setFilteredRecords] = useState({
    raw: [],
    chart: {},
  });

  const prepTableData = () => {
    const rows = filteredRecords.raw.map((r) => {
      let row = {};
      for (let [k, v] of Object.entries(r)) {
        if (k === "offense_name") {
          // this is a little risky -- assumes there is never a - in the penal
          // code section number
          v = v.slice(v.indexOf("-") + 1);
        }
        if (k in DATA_COLUMN_MAP) {
          row[DATA_COLUMN_MAP[k]] = v;
        }
      };
      const pop_mul = r["year"] === "All Years" ? 11.75 : (
          r["year"] == 2021 ? 0.75 : 1);
      row[DATA_COLUMNS.rate_pop] = 1000 * r["number"] / (r["pop"] * pop_mul);
      row[DATA_COLUMNS.dg_pop] = (
        (r["number"] / r["pop"]) / (r["number_white"] / r["pop_white"])
      );
      return row;
    });

    return rows;
  };

  const onDataDownload = async() => {
    // load the workbook with the cover sheet
    const url = "/CoverSheet.xlsx";
    const data = await (await fetch(url)).arrayBuffer();
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(data);

    // generate the data sheet
    const filteredJsonList = prepTableData();
    const data_ws = wb.addWorksheet("Data");
    data_ws.columns = Object.keys(filteredJsonList[0]).map((k) => {
      return {header: k, key: k};
    });
    data_ws.addRows(filteredJsonList);

    // generate and download the output xlsx file
    // this code from
    // https://github.com/exceljs/exceljs/issues/354#issuecomment-442801401
    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data],
        {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "PaperPrisons RJA Data.xlsx"
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const onDataTableDisplayToggled = () => {
    setShowTable(!showTable);
  };

  const sortYears = (a, b) => {
    if (a.indexOf("All") > -1) { return -1; }
    if (b.indexOf("All") > -1) { return 1; }
    return b - a;
  };

  const sortCounties = (a, b) => {
    if (a.indexOf("All") > -1) { return -1; }
    if (b.indexOf("All") > -1) { return 1; }
    return a.localeCompare(b);
  };

  const sortOffenses = (a, b) => {
    return a.localeCompare(b);
  };

  const fetchDataAvailable = async () => {
    setLoading(true);
    fetch("/api/metadata")
      .then(res => res.json())
      .then((result) => {
        setYearsAvailable(result.years.sort(sortYears));
        setCountiesAvailable(result.counties.sort(sortCounties));
        setOffensesAvailable(result.offenses.sort(sortOffenses));
    }).then(fetchData({
      counties: counties,
      decisionPoints: decisionPoints,
      races: races,
      offenses: offenses,
      years: years,
      measurement: measurement,
    }));
  }

  const fetchData = async (query) => {
    setLoading(true);

    // save a little bit of bandwidth
    if ('offenses' in query && query.offenses.length === offensesAvailable.length) {
      query.offenses = ["All Offenses"];
    }

    fetch("/api/data", {
      method: "POST",
      body: JSON.stringify(query),
    }).then(res => res.json())
      .then((result) => {
      console.log(result);
      setFilteredRecords(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDataAvailable().catch((e) => {});
  }, []);

  const onCountiesChange = async (values) => {
    if (values[values.length-1] === "All Counties") {
      values = ["All Counties"];
    } else if (values.includes("All Counties")) {
      values = values.filter((w) => w != "All Counties");
    }

    values.sort();
    setCounties(values);

    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        counties: values,
        decisionPoints: decisionPoints,
        races: races,
        offenses: offenses,
        years: years,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  const onYearsChange = (values) => {
    if (values[values.length-1] === "All Years") {
      values = ["All Years"];
    } else if (values.includes("All Years")) {
      values = values.filter((w) => w != "All Years");
    }

    values.sort();
    setYears(values);

    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        counties: counties,
        decisionPoints: decisionPoints,
        races: races,
        offenses: offenses,
        years: values,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  const onDecisionPointsChange = (values) => {
    // make sure these are sorted correctly
    values = DECISION_POINTS.filter((k) => values.includes(k));
    setDecisionPoints(values);

    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        counties: counties,
        decisionPoints: values,
        races: races,
        offenses: offenses,
        years: years,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  const onRacesChange = (values) => {
    setRaces(values);
    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        counties: counties,
        decisionPoints: decisionPoints,
        races: values,
        offenses: offenses,
        years: years,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  /*const onGendersChange = (values) => {
    if (!values || values.length === 0) {
      return;
    }
    setGenders(values);
    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        genders: values,
        races,
        decisionPoints,
        offenses,
        years,
        measurement,
      });
    }
  };*/

  const onOffensesChange = (values) => {
    setOffenses(values);

    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        counties: counties,
        decisionPoints: decisionPoints,
        races: races,
        offenses: values,
        years: years,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  const onMeasurementChange = (value) => {
    if (!value) {
      return;
    }
    setMeasurement(value);
    fetchData({
      counties: counties,
      decisionPoints: decisionPoints,
      races: races,
      offenses: offenses,
      years: years,
      measurement: value,
      //genders: genders,
    });
  };

  return (
    <div className="tool" id="tool">
      <p className="generic-page">
        This site provides summary data representing the raw numbers, rates per
        population, and disparity gaps by race of adults in the California
        criminal justice system using data provided by the California Department
        of Justice as well as by the Census Department. Access the Census data{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1acKdr3w9NlALgfUt8nLbtSWDqEfVxyQLKuz3r_pGkes/edit#gid=840124101"
          target="_blank"
        >
          here
        </a>
        {". "}
        For questions or comments, please email us at{" "}
        <a href="mailto:rja@paperprisons.org?subject=Feedback%20for%20Your%20App">
          rja@paperprisons.org
        </a>{" "}
        (See also{" "}
        <a
          href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4392014"
          target="_blank"
        >
          <i>
            Proving Actionable Racial Disparity Under the California Racial
            Justice Act
          </i>
        </a>
        , 76 UC L. Journal 1 (2023))
      </p>
      <div className="filters">
        <div>Customize: </div>
        <div className="filter">
          <PrivateSelect
            label="Year"
            multiple={true}
            disableAll={true}
            value={years}
            onChange={onYearsChange}
            options={yearsAvailable.map((y) => ({
              text: y === "All Years" ? "All Years (2010-2021)" : y,
              value: y,
            }))}
          />
        </div>
        <div className="filter">
          <PrivateSelect
            label="County"
            multiple={true}
            disableAll={true}
            value={counties}
            onChange={onCountiesChange}
            options={countiesAvailable.map((county) => ({
              text: county,
              value: county,
            }))}
          />
        </div>
        <div className="filter">
          <PrivateSelect
            label="Event Point"
            multiple={true}
            value={decisionPoints}
            onChange={onDecisionPointsChange}
            options={decisionPointsAvailable.map((dp) => ({
              text: dp,
              value: dp,
            }))}
          />
        </div>
        <div className="filter">
          <PrivateSelect
            label="Race"
            multiple={true}
            value={races}
            onChange={onRacesChange}
            options={racesAvailable.map((r) => ({
              text: r,
              value: r,
            }))}
          />
        </div>
        <div className="filter">
          <PrivateSelect
            label="Offense"
            multiple={true}
            value={offenses}
            onChange={onOffensesChange}
            options={offensesAvailable.map((o) => ({
              text: o,
              value: o,
            }))}
          />
        </div>
        <div className="filter">
          <PrivateSelect
            label="Measurement"
            value={measurement}
            onChange={onMeasurementChange}
            options={Object.values(MEASUREMENTS).map((m) => ({
              text: m,
              value: m,
            }))}
          />
        </div>
      </div>
      <div className="chart-selected">
        <h2>
          <h2>{counties.join(", ")}</h2>
        </h2>
        <p
          dangerouslySetInnerHTML={{
            __html: [
              measurement,
              decisionPoints.length === decisionPointsAvailable.length
                ? "All Event Points"
                : decisionPoints.join(", "),
              getYearsLabel(years),
              races.length === racesAvailable.length
                ? "All Races"
                : races.join(", "),
              offenses.length === offensesAvailable.length
                ? "All Offenses"
                : (offenses.length <= 4
                  ? offenses.join(", ")
                  : (offenses.length + " Offenses: "
                     + offenses[0] + ", ..., "
                     + offenses[offenses.length-1])
                ),
            ]
              .filter((item) => !!item)
              .map((item) => `<span>${item}</span>`)
              .join(";"),
          }}
        />
      </div>
      <div className="chart-containers">
        {loading ? (
          <div className="loading-animation-centered">
            <Grid />
          </div>
        ) : Object.keys(filteredRecords.chart).length > 0 ? (
          <IconChart
            data={filteredRecords.chart}
            years={years}
            races={Object.fromEntries(
              Object.entries(RACES).filter(([key]) => races.includes(key)),
            )}
            eventPoints={decisionPoints}
            measurement={measurement}
            agg={years.length > 1 || offenses.length > 1 || counties.length > 1}
          />
        ) : (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            <p>Unable to display due to insufficient data.</p>
            {years.length === 0 && <p>Select at least one year.</p>}
            {counties.length === 0 && <p>Select at least one county.</p>}
            {decisionPoints.length === 0 && (
              <p>Select at least one event point.</p>
            )}
            {races.length === 0 && <p>Select at least one race.</p>}
            {offenses.length === 0 && <p>Select at least one offense.</p>}
          </div>
        )}
      </div>

      {/* <pre>{JSON.stringify(filteredRecords, null, 4)}</pre> */}
      <div className="buttons">
        <div className="button" onClick={() => window && window.print()}>
          Print
        </div>
        <div className="button" onClick={onDataTableDisplayToggled}>
          {showTable ? "Hide Table" : "View Data"}
        </div>
        <div className="button" onClick={onDataDownload}>
          Download Data
        </div>
      </div>
      {showTable && filteredRecords.raw.length > 0 && (
        <DataTable data={prepTableData()} />
      )}
    </div>
  );
}
