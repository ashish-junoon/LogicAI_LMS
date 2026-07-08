import React from "react";
import DataTable from "react-data-table-component";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";

const Table = ({ columns, data }) => {
  const customStyles = {
    table: {
      style: {
        backgroundColor: "#fff",
        padding: 5
      },
    },

    headRow: {
      style: {
        minHeight: "40px",
        borderBottom: "1px solid #E5E7EB",
      },
    },

    headCells: {
      style: {
        fontSize: "12px",
        fontWeight: 600,
        color: "#374151",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },

    rows: {
      style: {
        minHeight: "40px",
        fontSize: "13px",
        color: "#111827",
        borderBottom: "1px solid #F3F4F6",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#F9FAFB",
        cursor: "pointer",
      },
    },

    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },

    pagination: {
      style: {
        minHeight: "44px",
        borderTop: "1px solid #E5E7EB",
        fontSize: "12px",
      },
    },

    noData: {
      style: {
        padding: "24px",
        fontSize: "13px",
        color: "#6B7280",
      },
    },
  };

  return (
    <div className="m-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100">
            <FiFilter size={16} />
          </button>

          <button className="flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900">
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        striped
        responsive
        pagination
      />
    </div>
  );
};

export default Table;