import React from 'react'
import DataTable from 'react-data-table-component';

const Table = ({columns, data}) => {
    const customStyles = {
    table: {
      style: {
        backgroundColor: "#fff",
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
    <div className="flex-1 border border-slate-200 bg-white shadow-sm m-3 rounded-md">
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
  )
}

export default Table