import React, { useState } from "react";

const formatNumber = (number) => {
  if (number > 1000) {
    const formattedNumber = (number / 1000).toFixed(1);
    return formattedNumber + "k";
  } else {
    return number.toString();
  }
};

const PersonIcon = ({
  value = 0,
  label = 0,
  race = "",
  scale = 1,
  onDisclaimerChange = () => {},
}) => {
  const valueRoof = Math.ceil(value);
  const maskHeight = {
    height: `${valueRoof * 100 - value * 100}%`,
  };

  if (valueRoof === 0 && scale !== 1) {
    onDisclaimerChange("N/A");
  }

  return (
    <div className="icon-chart-data">
      {Array(Math.min(valueRoof, 9))
        .fill(0)
        .map((_, index) => (
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
        ))}
      {valueRoof > 9 && (
        <div className="icon-chart-data-point" key="break">
          {/* Bolt-shaped break line SVG */}
          <svg
            className="bolt-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path d="M335 458 c-3 -7 -13 -60 -23 -118 l-18 -105 -27 59 c-15 32 -27 62 -27 67 0 24 -31 5 -44 -26 l-15 -35 -91 0 c-69 0 -91 -3 -88 -12 3 -9 35 -14 100 -16 l94 -3 13 28 13 27 30 -69 c50 -116 55 -114 78 23 18 102 22 103 40 10 13 -68 29 -73 54 -21 16 34 19 36 31 20 10 -14 28 -17 99 -17 66 0 87 3 84 13 -3 8 -31 13 -81 15 -64 2 -79 6 -90 22 -17 28 -34 25 -51 -7 -17 -32 -19 -28 -36 62 -6 33 -14 68 -16 78 -6 20 -23 23 -29 5z" />
            </g>
          </svg>
          <div className="icon-person icon-person-placeholder" />
          <span className="icon-chart-data-point-mask">
            <div className="icon-chart-data-label"></div>
          </span>
        </div>
      )}
      {valueRoof - 1 >= 9 && (
        <div className="icon-chart-data-point" key={valueRoof - 1}>
          {/* Render the 10th icon */}
          <svg
            aria-label="Person"
            className={`icon-person re-${race}`}
            title={valueRoof}
          >
            <use href="/images/sprites.svg#person"></use>
          </svg>
          <div className="icon-person icon-person-placeholder" />
          <span className="icon-chart-data-point-mask">
            <div className="icon-chart-data-label">{formatNumber(label)}</div>
          </span>
        </div>
      )}
    </div>
  );
};

const CHART_DISCLAIMER = {
  "N/A":
    "N/A: Our tool displays N/A when there are 10 or fewer underlying observations. Additionally, no disparity gap per prior event information is available for arrests.",
  "0.0":
    "Anywhere a disparity gap reads 0.0, it means that there were no white adults in the system at that point for a comparison of rates. Please see raw numbers and rates to see how adults of color are impacted by the decision point.",
};

const SCALE = {
  10: 1,
  100: 10,
  500: 50,
  1000: 100,
  5000: 500,
  10000: 1000,
  50000: 5000,
  100000: 10000,
  500000: 50000,
  1000000: 100000,
  5000000: 500000,
  10000000: 1000000,
};

const getScale = (data) => {
  let max = 0;
  data.forEach(({ items }) => {
    max = Math.max(...Object.values(items), max);
  });
  const list = Object.keys(SCALE)
    .map((item) => parseInt(item, 10))
    .concat([max]);
  return {
    max,
    scale: SCALE[`${list[list.sort((a, b) => a - b).indexOf(max) + 1]}`],
  };
};

const IconCharInner = ({ chartData, races, base, measurement }) => {
  const [disclaimer, setDisclaimer] = useState("");
  let scale = 1;
  const isRawNumber = [
    "Raw numbers",
    "Rate per population",
    "Rate per prior event point",
  ].includes(measurement);
  const yearData = JSON.parse(
    JSON.stringify({
      ...chartData,
      ...getScale(chartData.data),
    }),
  );
  if (
    measurement === "Raw numbers" ||
    measurement === "Rate per prior event point"
  ) {
    scale = yearData.scale;
  }
  const scaledYearData = yearData.data.map((yd) => {
    return {
      label: yd.label,
      items: Object.keys(yd.items).reduce((acc, k) => {
        acc[k] = {
          scaled: isRawNumber
            ? (yd.items[k] / scale).toFixed(2)
            : (yd.items[k] / (yd.records[k] || 1) / scale).toFixed(2),
          origin: isRawNumber
            ? yd.items[k]
            : (yd.items[k] / (yd.records[k] || 1)).toFixed(2),
          scale,
        };
        return acc;
      }, {}),
    };
  });
  return (
    <div className="icon-chart" key={yearData.year}>
      <h3>
        {yearData.year}
        <div className="chart-meta">
          <div className="chart-scale">``
            <PersonIcon value={1} race={base} scale={1} />
            {scale.toLocaleString()}{" "}
            {!base ? (scale > 1 ? "Adults" : "Adult ") : "White Adult"}
          </div>
        </div>
      </h3>
      <div className="icon-chart-races-container">
        {Object.keys(races)
          .filter((raceItem) => raceItem.toLowerCase() !== base)
          .map((raceItem) => {
            return (
              <div className="icon-chart-race-container" key={raceItem}>
                <h4>{races[raceItem]}</h4>
                <div className="icon-chart-rows">
                  {base && (
                    <div className="icon-chart-row">
                      <PersonIcon value={1} race={base} scale={1} label={1} />
                    </div>
                  )}
                  {scaledYearData.map((raceData, raceDataIndex) => {
                    return (
                      <div className="icon-chart-row" key={raceDataIndex}>
                        <div className="icon-chart-label">{raceData.label}</div>
                        <PersonIcon
                          value={raceData?.items[raceItem]?.scaled}
                          race={raceItem}
                          scale={scale}
                          label={raceData?.items[raceItem]?.origin}
                          onDisclaimerChange={setDisclaimer}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      {CHART_DISCLAIMER[disclaimer] && (
        <p className="icon-chart-disclaimer">{CHART_DISCLAIMER[disclaimer]}</p>
      )}
      {measurement.indexOf("Disparity gap") > -1 && (
        <p className="icon-chart-disclaimer">
          No disparity gap information is available for arrests because they are
          the beginning of the process.
        </p>
      )}
    </div>
  );
};

const IconCharts = ({ data, races, base, measurement }) => {
  return (
    <div className="icon-charts">
      {data.map((yd, idx) => (
        <IconCharInner
          key={idx}
          chartData={yd}
          races={races}
          base={base}
          measurement={measurement}
        />
      ))}
    </div>
  );
};

export { IconCharts, PersonIcon };
