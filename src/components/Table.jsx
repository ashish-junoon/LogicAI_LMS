import React from "react";
import DataTable from "react-data-table-component";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";

const Table = ({ columns, data, handleFilterBtn }) => {
  // const customStyles = {
  //   table: {
  //     style: {
  //       backgroundColor: "#FFFFFF",
  //       minWidth: "max-content",
  //     },
  //   },

  //   tableWrapper: {
  //     style: {
  //       display: "block",
  //       width: "100%",
  //       overflowX: "auto",
  //       overflowY: "hidden",
  //       scrollbarWidth: "none",
  //       msOverflowStyle: "none",
  //     },
  //   },

  //   headRow: {
  //     style: {
  //       minHeight: "32px",
  //       height: "32px",
  //       backgroundColor: "#f0f0fc",
  //       borderBottom: "1px solid #e8e8fc",
  //     },
  //   },

  //   headCells: {
  //     style: {
  //       fontSize: "11px",
  //       fontWeight: "600",
  //       color: "#53625D",
  //       paddingLeft: "16px",
  //       paddingRight: "16px",
  //       whiteSpace: "nowrap",
  //     },
  //   },

  //   rows: {
  //     style: {
  //       minHeight: "42px",
  //       height: "42px",
  //       fontSize: "12px",
  //       fontWeight: "500",
  //       color: "#1F2925",
  //       backgroundColor: "#FFFFFF",
  //       borderBottom: "1px solid #DCE6E1",
  //     },

  //     highlightOnHoverStyle: {
  //       backgroundColor: "#F7FAF8",
  //       cursor: "default",
  //     },
  //   },

  //   cells: {
  //     style: {
  //       paddingLeft: "16px",
  //       paddingRight: "16px",
  //       whiteSpace: "nowrap",
  //     },
  //   },

  //   pagination: {
  //     style: {
  //       minHeight: "45px",
  //       height: "45px",
  //       paddingLeft: "0",
  //       paddingRight: "0",
  //       borderTop: "0",
  //       backgroundColor: "#ffffff",
  //       fontSize: "13px",
  //       color: "#53625D",
  //     },
  //   },

  //   noData: {
  //     style: {
  //       minHeight: "120px",
  //       fontSize: "12px",
  //       color: "#8A9791",
  //       backgroundColor: "#FFFFFF",
  //     },
  //   },

  //   progress: {
  //     style: {
  //       minHeight: "120px",
  //     },
  //   },
  // };

    const customStyles = {
    table: {
      style: {
        backgroundColor: "#FFFFFF",
        minWidth: "max-content",
      },
    },

    tableWrapper: {
      style: {
        display: "block",
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      },
    },

    headRow: {
      style: {
        minHeight: "40px",
        height: "40px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
      },
    },

    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#4F6B8F",
        paddingLeft: "20px",
        paddingRight: "20px",
        whiteSpace: "nowrap",
      },
    },

    rows: {
      style: {
        minHeight: "40px",
        height: "40px",
        fontSize: "12px",
        fontWeight: "400",
        color: "#183B63",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#F8FAFC",
        cursor: "default",
      },
    },

    cells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        whiteSpace: "nowrap",
      },
    },

    pagination: {
      style: {
        minHeight: "48px",
        height: "48px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderTop: "0",
        backgroundColor: "#FFFFFF",
        fontSize: "13px",
        color: "#53625D",
      },
    },

    noData: {
      style: {
        minHeight: "120px",
        fontSize: "14px",
        color: "#8A9791",
        backgroundColor: "#FFFFFF",
      },
    },

    progress: {
      style: {
        minHeight: "120px",
      },
    },
  };

  return (
    <div className="m-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button onClick={handleFilterBtn} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100">
            <FiFilter size={16} />
          </button>

          <button className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/80">
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Enhanced Table */}

      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        highlightOnHover={false}
        pointerOnHover={false}
        striped={false}
        responsive
        pagination
      />
    </div>
  );
};

export default Table;
