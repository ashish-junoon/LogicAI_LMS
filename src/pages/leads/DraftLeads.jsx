import {
  PendingLeadsData,
} from "../../content/masterData";
import Table from "../../components/Table";

const DraftLeads = () => {
  const columns = [
    {
      name: "S. No",
      selector: (row) => row.index,
      sortable: true,
    },
    {
      name: "UserId",
      selector: (row) => row.leadId,
      sortable: true,
    },
    {
      name: "LeadId",
      selector: (row) => row.leadId,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      // right: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
      // right: true,
    },
    {
      name: "Pending Step",
      selector: (row) => row.pendingStep,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.createdBy,
      sortable: true,
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* header  */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">Draft Leads</div>
        </div>

        {/* table data */}
        <Table data={PendingLeadsData} columns={columns} />
      </div>
    </>
  );
};

export default DraftLeads;
