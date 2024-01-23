import React, { useEffect, useState } from "react";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { utils, writeFileXLSX } from "xlsx";

import { IconCharts } from "@/components/IconCharts";
import DataTable from "@/components/DataTable";
import PrivateSelect from "@/components/Select";
import Grid from "@/components/Grid";

const MEASUREMENTS_MAP = {
  "Raw numbers": "Raw numbers",
  "Rate per population": "Rate per 1,000 adults",
  "Rate per prior event point": "Rate per prior decision point",
  "Disparity gap per population": "Disparity gap per 1,000 adults",
  "Disparity gap per prior event point":
    "Disparity gap per prior decision point",
};

const MEASUREMENTS = Object.keys(MEASUREMENTS_MAP);

const RACES = {
  White: "White",
  Black: "Black",
  Hispanic: "Latino",
  AAPI: "Asian / Pacific Islander",
  "Native American": "Native American",
};

const getURLQueryParameterByName = (name, url = window.location.href) => {
  const sanitizedName = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp(`[?&]${sanitizedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export default function App() {
  const [yearsAvailable, setYearsAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [countiesAvailable, _] = useState([
    "All Counties",
    "Alameda",
    "Amador",
    "Butte",
    "Calaveras",
    "Colusa",
    "Contra Costa",
    "Del Norte",
    "El Dorado",
    "Fresno",
    "Glenn",
    "Humboldt",
    "Imperial",
    "Inyo",
    "Kern",
    "Kings",
    "Lake",
    "Lassen",
    "Los Angeles",
    "Madera",
    "Marin",
    "Mariposa",
    "Mendocino",
    "Merced",
    "Modoc",
    "Mono",
    "Monterey",
    "Napa",
    "Nevada",
    "Orange",
    "Placer",
    "Plumas",
    "Riverside",
    "Sacramento",
    "San Benito",
    "San Bernardino",
    "San Diego",
    "San Francisco",
    "San Joaquin",
    "San Luis Obispo",
    "San Mateo",
    "Santa Barbara",
    "Santa Clara",
    "Santa Cruz",
    "Shasta",
    "Sierra",
    "Siskiyou",
    "Solano",
    "Sonoma",
    "Stanislaus",
    "Sutter",
    "Tehama",
    "Trinity",
    "Tulare",
    "Tuolumne",
    "Ventura",
    "Yolo",
    "Yuba",
  ]);
  const [county, setCounty] = useState("All Counties");
  const [decisionPointsAvailable, setDecisionPointsAvailable] = useState([]);
  const [decisionPoints, setDecisionPoints] = useState([]);
  const [offensesAvailable, setOffensesAvailable] = useState([]);
  const [offenses, setOffenses] = useState([]);
  //const [gendersAvailable, setGendersAvailable] = useState([]);
  //const [genders, setGenders] = useState([]);
  const [races, setRaces] = useState(Object.keys(RACES));
  const [racesAvailable, setracesAvailable] = useState([]);
  const [measurement, setMeasurement] = useState("Raw numbers");
  const [chartConfig, setChartConfig] = useState({
    ratio: 1,
    base: null,
  });
  const [fullRecords, setFullRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState({
    raw: [],
    chart: [],
  });
  const [showTable, setShowTable] = useState(false);

  const onDataDownload = () => {
    const ws = utils.json_to_sheet(filteredRecords.raw);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "PaperPrison - Data.xlsx");
  };
  const onDataTableDisplayToggled = () => {
    setShowTable(!showTable);
  };
  const filter = (
    { decisionPoints, races, offenses, years, measurement, genders },
    records = fullRecords,
  ) => {
    const allowedEventPoints = [
      "Charge",
      "Conviction",
      "Prison sentence",
      "Felony conviction",
    ];
    const raw = records.filter((r) => {
      if (
        measurement === "Rate per prior event point" &&
        !allowedEventPoints.includes(r["Event Point"])
      ) {
        // Exclude records with measurement "Rate per prior event point" and other event points
        return false;
      }
      if (races.length > 0 && !races.includes(r.Race)) {
        return false;
      }
      if (
        decisionPoints.length > 0 &&
        !decisionPoints.includes(r["Event Point"])
      ) {
        return false;
      }
      if (offenses.length > 0 && !offenses.includes(r.Offenses)) {
        return false;
      }
      /* if (genders.length > 0 && !genders.includes(r.Gender)) {
        return false;
      }*/
      if (!years.includes(r.Year)) {
        return false;
      }
      return true;
    });
    const filtered = raw.reduce((acc, item) => {
      if (!acc[item.Year]) {
        acc[item.Year] = {
          year: item.Year,
          data: {},
        };
      }
      if (!acc[item.Year].data[item["Event Point"]]) {
        acc[item.Year].data[item["Event Point"]] = {
          label: item["Event Point"],
          items: {},
          records: {},
        };
      }
      if (!acc[item.Year].data[item["Event Point"]].items[item["Offenses"]]) {
        acc[item.Year].data[item["Event Point"]].items[item["Offenses"]] = {
          label: item["Offenses"],
          items: {},
        };
      }
      acc[item.Year].data[item["Event Point"]].items[item["Offenses"]].items[
        item["Race"]
      ] = item[measurement] || 0;

      if (!acc[item.Year].data[item["Event Point"]].records[item["Race"]]) {
        acc[item.Year].data[item["Event Point"]].records[item["Race"]] = 1;
      } else {
        acc[item.Year].data[item["Event Point"]].records[item["Race"]]++;
      }
      return acc;
    }, {});
    setFilteredRecords({
      raw,
      chart: Object.values(filtered).map((item) => {
        item.data = Object.values(item.data).map((d) => {
          d.items = Object.values(d.items).reduce(
            (acc, dd) => {
              Object.keys(dd.items).forEach((k) => {
                let temp = acc[k] + (dd.items[k] || 0);
                if (measurement === "Raw numbers") {
                  temp = Math.ceil(temp);
                } else {
                  temp = Number(Number(temp).toFixed(2));
                }
                acc[k] = temp;
                return acc;
              });

              return acc;
            },
            { AAPI: 0, Black: 0, Hispanic: 0, White: 0, "Native American": 0 },
          );
          return d;
        });
        return item;
      }),
    });
  };

  // https://docs.google.com/spreadsheets/d/1nJ3k0KXVrhXm8La-lOTpw8U7xL7Cc-GioANxxH5KsXE/edit#gid=0
  // Make sure share this link to the public, so anyone who has the link can open this spreedsheet
  const fetchData = async (sheet) => {
    setLoading(true);
    const parser = new PublicGoogleSheetsParser();
    parser
      //.parse("1j9YBu-u-5tTgEAUy7uP9NmHdSLEwDVKWZJsMDTvAPXQ", sheet)
      .parse("1qFsF5ivZUHDRsst4sHZYt_eMZypO93eYUpXT1XBQYYQ", sheet)
      .then((originItems) => {
        let _years = [];
        const _decisionPoints = [];
        const _offenses = [];
        const _races = [];
        //const _genders = [];

        const items = originItems.map((item) => {
          item.Offenses = item.PC_offense;
          item.Race = item.race;
          //item.Gender = item.gender;
          item.Year = item.year;
          item["Event Point"] = item.decision;
          item["Raw numbers"] = item.number;
          item["Rate per population"] = isNaN(item.rate_per_100_pop)
            ? 0
            : item.rate_per_100_pop;
          item["Rate per prior event point"] = isNaN(item.rate_cond_previous)
            ? 0
            : item.rate_cond_previous;

          item["Disparity gap per population"] = isNaN(item.disparity_gap_pop_w)
            ? 0
            : item.disparity_gap_pop_w;
          item["Disparity gap per prior event point"] = isNaN(
            item.disparity_gap_cond_w,
          )
            ? 0
            : item.disparity_gap_cond_w;
          return item;
        });
        items.forEach((item) => {
          if (_years.indexOf(item["Year"]) === -1) {
            _years.push(item["Year"]);
          }
          /*  if (_genders.indexOf(item["Gender"]) === -1) {
             _genders.push(item["Gender"]);
             }*/
          if (_decisionPoints.indexOf(item["Event Point"]) === -1) {
            _decisionPoints.push(item["Event Point"]);
          }
          if (_offenses.indexOf(item["Offenses"]) === -1) {
            _offenses.push(item["Offenses"]);
          }
          if (_races.indexOf(item["Race"]) === -1) {
            _races.push(item["Race"]);
          }
        });
        _years = _years.reverse().sort((a, b) => {
          if (a === "2010-2021") {
            return -1;
          } else if (b === "2010-2021") {
            return 1;
          } else {
            return b - a;
          }
        });
        //const defaultGender = _genders[0];
        const mostRecentYear = _years[0];
        // const defaultOffense = _offenses[0];
        setYears([mostRecentYear]);
        setYearsAvailable(_years);
        // setGendersAvailable(_genders);
        //setGenders([defaultGender]);
        setDecisionPointsAvailable(_decisionPoints);
        setDecisionPoints(_decisionPoints);
        setOffenses(["459 PC-BURGLARY"]);
        setOffensesAvailable(_offenses);
        setFullRecords(items);
        setracesAvailable(_races);
        setRaces(_races);
        setLoading(false);
        filter(
          {
            races: _races,
            // genders: [defaultGender],
            decisionPoints: decisionPoints,
            offenses: ["459 PC-BURGLARY"],
            years: [mostRecentYear],
            measurement,
          },
          items,
        );
      });
  };

  useEffect(() => {
    const sheet = getURLQueryParameterByName("sheet") || "All Counties";
    fetchData(sheet).catch((e) => {});
  }, []);

  const onCountyChange = async (value) => {
    setCounty(value);
    await fetchData(value);
    filter({
      races,
      //genders,
      decisionPoints,
      years,
      offenses,
      measurement,
    });
  };

  const onYearChange = (values) => {
    setYears(values);
    filter({
      races,
      decisionPoints,
      // genders,
      years: values,
      offenses,
      measurement,
    });
  };

  const onDecisionPointChange = (values) => {
    setDecisionPoints(values);
    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: [],
      });
    } else {
      filter({
        races,
        decisionPoints: values,
        offenses,
        // genders,
        years,
        measurement,
      });
    }
  };

  const onRacesChange = (values) => {
    setRaces(values);
    if (values.length === 0) {
      setFilteredRecords({
        raw: [],
        chart: [],
      });
    } else {
      filter({
        races: values,
        decisionPoints,
        // genders,
        offenses,
        years,
        measurement,
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
        chart: [],
      });
    } else {
      filter({
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
    if (!values || values.length === 0) {
      return;
    }
    setOffenses(values);
    filter({
      races,
      // genders,
      decisionPoints,
      offenses: values,
      years,
      measurement,
    });
  };

  const onMeasurementsChange = (value) => {
    if (value) {
      setMeasurement(value);
      if (
        value === "Disparity gap per population" ||
        value === "Disparity gap per prior event point"
      ) {
        setChartConfig({
          base: "white",
          ratio: 0.01,
        });
      } else if (value === "Raw numbers") {
        setChartConfig({
          base: null,
          ratio: 1,
        });
      } else {
        setChartConfig({
          base: null,
          ratio: 0.1,
        });
      }

      filter({
        races,
        //genders,
        decisionPoints,
        offenses,
        years,
        measurement: value,
      });
    } else {
      setMeasurement("Raw numbers");
      setChartConfig({
        base: null,
        ratio: 1,
      });

      filter({
        races,
        genders,
        decisionPoints,
        offenses,
        years,
        measurement: "Raw numbers",
      });
    }
  };

  return (
    <div className="tool" id="tool">
      <p className="generic-page">
        This site provides summary data representing the raw numbers, rates per
        population, and disparity gaps by race of adults in the California
        criminal justice system using data provided by the California Department
        of Justice as well as by Census Department. Access the Census data{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1acKdr3w9NlALgfUt8nLbtSWDqEfVxyQLKuz3r_pGkes/edit#gid=840124101"
          target="_blank"
        >
          here
        </a>
        {". "}
        For question or comments, please email us at{" "}
        <a href="mailto:rja@paperprisons.org?subject=Feedback%20for%20Your%20App">
          rja@paperprisons.org
        </a>
      </p>
      <div className="filters">
        <div>Customize: </div>
        <div className="filter">
          <PrivateSelect
            label="Years"
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
            label="Counties"
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
            label="Offenses"
            value={offenses}
            multiple={false}
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
            options={MEASUREMENTS.map((m) => ({
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
              `${offenses}`,
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
        ) : decisionPoints.length === 0 ? (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            Select an Event Point.
          </div>
        ) : filteredRecords.chart.length === 0 ? (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            Unable to display due to insufficient data.
          </div>
        ) : (
          <IconCharts
            data={filteredRecords.chart}
            races={RACES}
            base={chartConfig.base}
            measurement={measurement}
          />
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
