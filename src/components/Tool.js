import React, { useEffect, useState } from "react";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { utils, writeFileXLSX } from "xlsx";
import { IconCharts } from "@/components/IconCharts";
import DataTable from "@/components/DataTable";
import PrivateSelect from "@/components/Select";
import Grid from "@/components/Grid";

const MEASUREMENTS = {
  RAW: "Raw numbers",
  RATE: "Rate per population",
  //R_PEP: "Rate per prior event point",
  DG: "Disparity gap per population",
  //DG_PEP: "Disparity gap per prior event point",
};

const MEASUREMENTS_MAP = {
  "Raw numbers": "Raw numbers",
  "Rate per population": "Rate per unit population",
  //"Rate per prior event point": "Rate per prior decision point",
  "Disparity gap per population": "Disparity gap vs. white adults",
  //"Disparity gap per prior event point":
    //"Disparity gap per prior decision point",
};

const RACES = {
  White: "White",
  Black: "Black",
  Hispanic: "Latino",
  AAPI: "Asian / Pacific Islander",
  "Native American": "Native American",
};

const DECISION_POINTS = {
  "Arrest": "Arrest",
  "Court": "Charge",
  "Conviction": "Conviction",
  "Felony conviction": "Felony conviction",
  "Prison sentence": "Prison sentence",
};

const DEFAULTS = {
  years: ["All Years"],
  county: "All Counties",
  decisionPoints: Object.keys(DECISION_POINTS),
  offenses: ["459 PC-BURGLARY"],
  races: Object.keys(RACES),
  measurement: "Raw numbers",
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
  const [decisionPointsAvailable, setDecisionPointsAvailable] = useState(Object.keys(DECISION_POINTS));
  const [racesAvailable, setRacesAvailable] = useState(Object.keys(RACES));
  //const [gendersAvailable, setGendersAvailable] = useState([]);

  const [years, setYears] = useState(DEFAULTS.years);
  const [county, setCounty] = useState(DEFAULTS.county);
  const [offenses, setOffenses] = useState(DEFAULTS.offenses);
  const [decisionPoints, setDecisionPoints] = useState(DEFAULTS.decisionPoints);
  const [races, setRaces] = useState(DEFAULTS.races);
  //const [genders, setGenders] = useState([]);
  const [measurement, setMeasurement] = useState(DEFAULTS.measurement);
  const [filteredRecords, setFilteredRecords] = useState({
    raw: [],
    chart: {},
  });

  const onDataDownload = () => {
    const selectedKeys = [
      "county",
      "PC_code",
      "PC_offenses",
      "Race",
      "Year",
      "Event Point",
      "Raw numbers",
      "Population",
      //"Rate per population",
      //"Rate per prior event point",
      "Disparity gap per population",
      //"Disparity gap per prior event point",
    ];
    let jsonList = filteredRecords.raw;
    const filteredJsonList = jsonList.map((obj) => {
      const filteredObj = {};
      selectedKeys.forEach((key) => {
        if (obj.hasOwnProperty(key)) {
          filteredObj[key] = obj[key];
        }
      });
      return filteredObj;
    });
    const ws = utils.json_to_sheet(filteredJsonList);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "PaperPrison - RJA Data.xlsx");
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
      county: county,
      decisionPoints: decisionPoints,
      races: races,
      offenses: offenses,
      years: years,
      measurement: measurement,
    }));
  }

  const fetchData = async (query) => {
    setLoading(true);
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

  const onCountyChange = async (value) => {
    if (!value) {
      return;
    }
    setCounty(value);
    fetchData({
      county: value,
      decisionPoints: decisionPoints,
      races: races,
      offenses: offenses,
      years: years,
      measurement: measurement,
      //genders: genders,
    });
  };

  const onYearChange = (values) => {
    setYears(values);
    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        county: county,
        decisionPoints: decisionPoints,
        races: races,
        offenses: offenses,
        years: values,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  const onDecisionPointChange = (values) => {
    setDecisionPoints(values);
    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: {},
      });
    } else {
      fetchData({
        county: county,
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
        county: county,
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
        county: county,
        decisionPoints: decisionPoints,
        races: races,
        offenses: values,
        years: years,
        measurement: measurement,
        //genders: genders,
      });
    }
  };

  const onMeasurementsChange = (value) => {
    if (!value) {
      return;
    }
    setMeasurement(value);
    fetchData({
      county: county,
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
            onChange={onYearChange}
            options={yearsAvailable.map((y) => ({
              text: y,
              value: y,
            }))}
          />
        </div>
        <div className="filter">
          <PrivateSelect
            label="County"
            value={county}
            multiple={false}
            onChange={onCountyChange}
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
            onChange={onDecisionPointChange}
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
            onChange={onMeasurementsChange}
            options={Object.keys(MEASUREMENTS_MAP).map((m) => ({
              text: m,
              value: m,
            }))}
          />
        </div>
      </div>
      <div className="chart-selected">
        <h2>
          <h2>{county}</h2>
        </h2>
        <p
          dangerouslySetInnerHTML={{
            __html: [
              MEASUREMENTS_MAP[measurement],
              decisionPoints.length === decisionPointsAvailable.length
                ? "All Event Points"
                : decisionPoints.join(", "),
              years.length === yearsAvailable.length
                ? "All Years"
                : years.join(", "),
              races.length === racesAvailable.length
                ? "All Races"
                : races.join(", "),
              offenses.length === offensesAvailable.length
                ? "All Offenses"
                : offenses.join(", "),
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
          <IconCharts
            data={filteredRecords.chart}
            years={years}
            races={Object.fromEntries(
              Object.entries(RACES).filter(([key]) => races.includes(key)),
            )}
            eventPoints={decisionPoints}
            measurement={measurement}
          />
        ) : (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            <p>Unable to display due to insufficient data.</p>
            {years.length === 0 && <p>Select at least one year.</p>}
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
        <DataTable data={filteredRecords.raw} />
      )}
    </div>
  );
}
