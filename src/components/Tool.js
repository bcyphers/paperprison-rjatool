import React, { useEffect, useState } from "react";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { utils, writeFileXLSX } from "xlsx";
import { IconCharts } from "@/components/IconCharts";
import DataTable from "@/components/DataTable";
import PrivateSelect from "@/components/Select";
import Grid from "@/components/Grid";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

const QUERY_PARAMS = [
  "years",
  "counties",
  "offenses",
  "decisionPoints",
  "races",
];

export const DATA_COLUMNS = {
  county: "County",
  year: "Year",
  code: "Penal Code Section",
  offense: "Offense",
  decision: "Event Point",
  race: "Race",
  //gender: "Gender",
  number: "Number",
  pop: "Population",
  rate_pop: "Rate per 1,000 Population per Year",
  //dg_pop: "Disparity Gap per Population",
};

const DATA_COLUMN_MAP = {
  "county": DATA_COLUMNS.county,
  "year": DATA_COLUMNS.year,
  "PC_code": DATA_COLUMNS.code,
  "PC_offense": DATA_COLUMNS.offense,
  "decision": DATA_COLUMNS.decision,
  "race": DATA_COLUMNS.race,
  //"gender": "Gender",
  "number": DATA_COLUMNS.number,
  "pop": DATA_COLUMNS.pop,
};

const MEASUREMENTS = {
  RAW: "Raw numbers",
  RATE: "Rate per population",
  DG: "Disparity gap per population",
  //R_PEP: "Rate per prior event point",
  //DG_PEP: "Disparity gap per prior event point",
};

const MEASUREMENTS_MAP = {
  [MEASUREMENTS.RAW]: "Raw numbers",
  [MEASUREMENTS.RATE]: "Rate per unit population",
  [MEASUREMENTS.DG]: "Disparity gap vs. white adults",
  //MEASUREMENTS.R_PEP: "Rate per prior decision point",
  //MEASUREMENTS.DG_PEP: "Disparity gap per prior decision point",
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

  const [years, setYears] = useState(DEFAULTS.years);
  const [counties, setCounties] = useState(DEFAULTS.counties);
  const [offenses, setOffenses] = useState(DEFAULTS.offenses);
  const [decisionPoints, setDecisionPoints] = useState(DEFAULTS.decisionPoints);
  const [races, setRaces] = useState(DEFAULTS.races);
  //const [genders, setGenders] = useState([]);
  const [measurement, setMeasurement] = useState(DEFAULTS.measurement);

  const [urlQueryString, setUrlQueryString] = useState("");
  const [filteredRecords, setFilteredRecords] = useState({
    raw: [],
    chart: {},
  });

  const [available, setAvailable] = useState({
    years: [],
    counties: [],
    offenses: [],
    decisionPoints: DECISION_POINTS,
    races: Object.keys(RACES),
  });

  //const [yearsAvailable, setYearsAvailable] = useState([]);
  //const [countiesAvailable, setCountiesAvailable] = useState([]);
  //const [offensesAvailable, setOffensesAvailable] = useState([]);
  //const [decisionPointsAvailable, setDecisionPointsAvailable] = useState(available.decisionPoints);
  //const [racesAvailable, setRacesAvailable] = useState(available.races);

  const prepTableData = () => {
    const data = filteredRecords.raw.map((r) => {
      let row = {};
      for (let [k, v] of Object.entries(r)) {
        if (k === "PC_offense") {
          v = v.slice(v.indexOf("PC-") + 3);
        }
        if (k in DATA_COLUMN_MAP) {
          row[DATA_COLUMN_MAP[k]] = v;
        }
      };
      const pop_mul = r["year"] === "All Years" ? 11.75 : (
          r["year"] == 2021 ? 0.75 : 1);
      row[DATA_COLUMNS.rate_pop] = 1000 * r["number"] / (r["pop"] * pop_mul);
      //row[DATA_COLUMNS.dg_pop] = (
        //(r["number"] / r["pop"]) / (r["number_white"] / r["pop_white"])
      //);
      return row;
    });

    return data;
  };

  const onDataDownload = () => {
    const filteredJsonList = prepTableData();
    const ws = utils.json_to_sheet(filteredJsonList);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "PaperPrison - RJA Data.xlsx");
  };

  const onDataTableDisplayToggled = () => {
    setShowTable(!showTable);
  };

  const onCopyLink = () => {

  }

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

  const B32_CHR = 'abcdefghijklmnopqrstuvwxyzABCDEF'.split('');

  const encode = (vals, valsAvailable) => {
    let out = "";
    let chr = 0;
    for (let i = 0; i < valsAvailable.length; i++) {
      if (vals.includes(valsAvailable[i])) {
        chr |= 1 << (i % 5);
      }
      if ((i + 1) % 5 == 0) {
        out += B32_CHR[chr];
        chr = 0;
      }
    }
    out += B32_CHR[chr];
    return out;
  };

  const decode = (coded, valsAvailable) => {
    let bits;
    let vals = [];
    for (let i = 0; i < valsAvailable.length; i++) {
      if (i % 5 == 0) {
        bits = B32_CHR.indexOf(coded[0]);
        coded = coded.slice(1);
      }
      if (bits & 1 == 1) {
        vals.push(valsAvailable[i]);
      };
      bits >>= 1;
    }
    return vals;
  };

  const compress = (str) => {
		let out = "";
		for (let i = 0; i < str.length; i++) {
			let j = i;
			while (j < str.length - 1 && str[i] === str[j + 1]) {
				j++;
			}
			out += str[i] + (j + 1 - i);
      i = j;
		}
		return out;
  };

  const decompress = (str) => {
    let out = "";
    const splits = [...str.matchAll(/([a-zA-F]+)(\d+)?/g)];
		for (let [_, s, num] of splits) {
      if (num) {
        out += s.slice(0, -1);
        out += s.slice(-1).repeat(parseInt(num));
      } else {
        out += s;
      }
    }
    return out;
  };

  const encodeQueryString = () => {
    const searchParams = new URLSearchParams();
    const queryParams = {
      years: [years, available.years],
      counties: [counties, available.counties],
      offenses: [offenses, available.offenses],
      decisionPoints: [decisionPoints, available.decisionPoints],
      races: [races, available.races],
    };
    for (const [k, [v, available]] of Object.entries(queryParams)) {
      let encoded = encode(v, available);
      const compressed = compress(encoded);
      if (compressed.length < encoded.length) {
        encoded = compressed;
      }
      searchParams.append(k, encoded);
    }

    const out = window.location.href.replace(
        window.location.search,
        "?" + searchParams.toString());

    setUrlQueryString(out);
    navigator.clipboard.writeText(out);
  };

  const decodeQueryParams = (_available) => {
    const queryParams = new URLSearchParams(window.location.search);
    let query = {};

    for (const [k, v] of queryParams) {
      if (QUERY_PARAMS.includes(k)) {
        const vals = decode(decompress(v), _available[k]);
        onChange(k, vals);
        query[k] = vals;
      }
    }
    return query;
  };

  const fetchDataAvailable = async () => {
    setLoading(true);

    fetch("/api/metadata")
      .then(res => res.json())
      .then((result) => {
        const _available = {
          ...available,
          years: result.years.sort(sortYears),
          counties: result.counties.sort(sortCounties),
          offenses: result.offenses.sort(sortOffenses),
        };
        setAvailable(_available);
        return decodeQueryParams(_available);
      }).then((urlParams) => {
      let query = {
        counties: counties,
        decisionPoints: decisionPoints,
        races: races,
        offenses: offenses,
        years: years,
        measurement: measurement,
        ...urlParams,
      };

      fetchData(query);
    });
  }

  const fetchData = async (query) => {
    setLoading(true);

    // save a little bit of bandwidth
    if ('offenses' in query && query.offenses.length === available.offenses.length) {
      query.offenses = ["All Offenses"];
    }

    fetch("/api/data", {
      method: "POST",
      body: JSON.stringify(query),
    }).then(res => res.json())
      .then((result) => {
      setFilteredRecords(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDataAvailable().catch((e) => {});
  }, []);

  const onChange = async (key, val) => {
    if (key === "counties") {
      setCounties(val);
    } else if (key === "decisionPoints") {
      setDecisionPoints(val);
    } else if (key === "races") {
      setRaces(val);
    } else if (key === "offenses") {
      if (val.includes("All Offenses")) {
        setOffenses(available.offenses);
      } else {
        setOffenses(val);
      }
    } else if (key === "years") {
      setYears(val);
    } else if (key === "measurement") {
      setMeasurement(val);
    }
  };

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
            options={available.years.map((y) => ({
              text: y,
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
            options={available.counties.map((county) => ({
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
            options={available.decisionPoints.map((dp) => ({
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
            options={available.races.map((r) => ({
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
            options={available.offenses.map((o) => ({
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
            options={Object.keys(MEASUREMENTS_MAP).map((m) => ({
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
              MEASUREMENTS_MAP[measurement],
              decisionPoints.length === available.decisionPoints.length
                ? "All Event Points"
                : decisionPoints.join(", "),
              years.join(", "),
              races.length === available.races.length
                ? "All Races"
                : races.join(", "),
              offenses.length === available.offenses.length
                ? "All Offenses"
                : (offenses.length <= 4
                  ? offenses.join(", ")
                  : (offenses.length + " offenses: "
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
				<Popover placement="bottom">
					<PopoverTrigger>
						<div className="button" onClick={encodeQueryString}>
              Copy Link
						</div>
					</PopoverTrigger>
					<PopoverContent>{urlQueryString}</PopoverContent>
				</Popover>
        {/*<div className="button" onClick={() => window && window.print()}>
          Print
        </div>*/}
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
