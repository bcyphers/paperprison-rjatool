import React from "react";
import { MEASUREMENTS } from "@/components/Tool";

const formatNumber = (n, decimal=true) => {
  const number = Number(n);
  if (number > 1000000) {
    if (decimal) {
      return (number / 1000000).toPrecision(3) + "M";
    } else {
      return Math.round(number / 1000000) + "M";
    }
  } else if (number > 1000) {
    if (decimal) {
      return (number / 1000).toPrecision(3) + "k";
    } else {
      return Math.round(number / 1000) + "k";
    }
  } else if (Number.isInteger(number)) {
    // if it's an integer less than 1000, display normally
    return number;
  } else if (number > 1) {
    // round smaller numbers to three sigfigs again
    return number.toPrecision(3);
  } else {
    // no more than two digits after the decimal
    return number.toFixed(2);
  }
};

const getYearsLabel = (years) => {
  if (years.includes("All Years")) {
    return "All Years (2010-2021)";
  }

  let years_list = [];
  let last_year = [years[0], years[0]];
  for (let i = 1; i < years.length; i++) {
    if (parseInt(years[i]) === parseInt(years[i-1]) + 1) {
      last_year[1] = years[i];
    } else {
      if (last_year[0] === last_year[1]) {
        years_list.push(last_year[0]);
      } else {
        years_list.push(last_year.join("-"));
      }
      last_year = [years[i], years[i]];
    }
  }
  if (last_year[0] === last_year[1]) {
    years_list.push(last_year[0]);
  } else {
    years_list.push(last_year.join("-"));
  }
  return years_list.join(", ");
};

const PersonIcon = ({ value = 0, label = 0, race = "" }) => {
  const valueRoof = Math.ceil(value);
  const maskHeight = {
    height: `${valueRoof * 100 - value * 100}%`,
  };
  return (
    <div className="icon-chart-data">
      {valueRoof > 0 ? (
        Array(valueRoof)
          .fill(0)
          .map((_, index) => {
            return (
              <div className="icon-chart-data-point" key={index}>
                <svg
                  aria-label="Person"
                  className={`icon-person re-${race}`}
                  title={valueRoof}
                >
                  <use href="/images/sprites.svg#person"></use>
                </svg>
                <span
                  className="icon-chart-data-point-mask"
                  style={valueRoof - 1 === index ? maskHeight : {}}
                >
                  {valueRoof - 1 === index && (
                    <div className="icon-chart-data-label">
                      {formatNumber(label)}
                    </div>
                  )}
                </span>
              </div>
            );
          })
      ) : (
        <div className="icon-chart-data-point">
          <div className="icon-person icon-person-placeholder" />
          <span className="icon-chart-data-point-mask">
            <div className="icon-chart-data-label">
              {label > 0 ? formatNumber(label) : "N/A"}
            </div>
          </span>
        </div>
      )}
    </div>
  );
};

const CHART_DISCLAIMER = {
  n_a: "A displayed value of N/A indicates there are 10 or fewer underlying observations for at least one of the variables needed to compute the selected metric.",
  zero: "A displayed value of 0.00 means that sufficient data is available to compute the selected metric, but its value is less than 0.005.",
  agg: "Data may not be available for all selected offenses, counties, and years. Aggregate numbers reflect the combination of all available data. Select ‘View Data’ to see which data points are included in the aggregate data shown above.",
};

const scaleDown = (data) => {
  let max = 0;

  // find largest value present in data
  Object.values(data).forEach((items) => {
    max = Math.max(...Object.values(items), max);
  });
  let scale = 1;
  while (max * scale < 1) {
    scale *= 10;
  }
  return 1 / scale;
};

const scaleUp = (data) => {
  let max = 0;

  // find largest value present in data
  Object.values(data).forEach((items) => {
    max = Math.max(...Object.values(items), max);
  });
  let scale = 10;
  while (max / scale > 10) {
    scale *= 10;
  }
  if (max / scale < 2) {
    scale /= 2;
  }
  return scale;
};

const IconChart = ({ data, years, races, eventPoints, measurement, agg }) => {
  let disclaimers = {
    n_a: false,
    zero: false,
    agg: agg,
  };

  let scale = 1;

  if (measurement === MEASUREMENTS.RAW) {
    scale = scaleUp(data);
  } else if (measurement === MEASUREMENTS.RATE) {
    scale = scaleDown(data);
  }

  const base = (measurement === MEASUREMENTS.DG) ? "white" : null;
  const filteredRaces = Object.keys(races).filter(
    (raceItem) => raceItem.toLowerCase() !== base,
  );

  const filteredEventPoints = eventPoints;

  const scaledData = {};
  for (const r of filteredRaces) {
    scaledData[r] = {};

    for (const ep of filteredEventPoints) {
      if (!((r in data) && (ep in data[r]))) {
        disclaimers.n_a = true;
        scaledData[r][ep] = { scaled: 0, origin: 0 };
        continue;
      }

      let _origin = data[r][ep];
      if (scale < 1) {
        _origin /= scale;
      }
      const _scaled = (data[r][ep] / scale).toFixed(2);

      if (_origin < 0.005 && _origin > 0) {
        disclaimers.zero = true;
      }

      scaledData[r][ep] = {
        scaled: _scaled,
        origin: _origin,
      };
    }
  }

  let scaleString = formatNumber(scale, false);
  let postScaleString = "";
  if (scale < 1) {
    scaleString = "1";
    postScaleString = "per " + formatNumber(1 / scale, false) + " population";
  }

  const years_label = getYearsLabel(years);

  return (
    <div className="icon-charts">
    <div className="icon-chart" key={years_label}>
      <h3>
        {years_label}
        <div className="chart-meta">
          <div className="chart-scale">
            <PersonIcon value={1} race={null} /> {scaleString}{" "}
            {base ? "incident per population relative to white" : scale > 1 ? "incidents" : "incident"}{" "}
            {postScaleString}
          </div>
        </div>
      </h3>
      <div className="icon-chart-races-container">
        {Object.keys(scaledData).map((raceItem) => {
          return (
            <div className="icon-chart-race-container" key={raceItem}>
              <h4>{races[raceItem]}</h4>
              <div className="icon-chart-rows">
                {base && (
                  <div className="icon-chart-row">
                    <PersonIcon value={1} race={base} label={1} />
                  </div>
                )}
                {Object.keys(scaledData[raceItem]).map((ep, ix) => {
                  return (
                    <div className="icon-chart-row" key={ix}>
                      <div className="icon-chart-label">{ep}</div>
                      <PersonIcon
                        value={scaledData[raceItem][ep].scaled}
                        race={raceItem}
                        label={scaledData[raceItem][ep].origin}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {Object.keys(disclaimers)
          .filter((d) => disclaimers[d])
          .map((d) => (
            <p className="icon-chart-disclaimer">{CHART_DISCLAIMER[d]}</p>
          ))}
      </div>
    </div>
    </div>
  );
};

export { IconChart, PersonIcon, getYearsLabel };
