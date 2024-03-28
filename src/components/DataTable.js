import React from "react";
import { useState } from "react";
import { DATA_COLUMNS } from "@/components/Tool";

const DataTable = ({ data }) => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleData = data.slice(startIndex, endIndex);

  return (
    <div className="table-container">
      <table className="ui celled table">
        <thead>
          <tr>
            {Object.values(DATA_COLUMNS).map((r) => (
              <th key={r}>{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleData.map((row, rIndex) => {
            return (
              <tr key={rIndex}>
                {Object.values(DATA_COLUMNS).map((k) => {
                  let value = row[k];
                  if (k === DATA_COLUMNS.number && value < 10) {
                    value = "N/A";
                  } else if ([DATA_COLUMNS.rate_pop].includes(k)) {
                    value = parseFloat(value).toPrecision(3);
                  }
                  return <td key={k}>{value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="pagination-button"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
