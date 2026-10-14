import { useEffect, useState } from 'react'
import Table from '../../components/Table'
import { GetAllApplications } from '../../api/application'

const RejectedLeads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRejectedLeads = async () => {
    try {
      const response = await GetAllApplications({
        role: 'admin',
        created_by: 'admin',
      })

      if (!response?.status || !Array.isArray(response?.data)) {
        throw new Error(response?.message || 'Failed to fetch rejected leads.')
      }

      const rejectedLeads = response.data
        // .filter((item) =>
        //   String(item?.status || item?.loan_status || item?.application_status || '')
        //     .toLowerCase()
        //     // .includes('reject'),
        // )
        .map((item) => ({
          leadId: item.application_id || '-',
          name: item.business_owner_name || '-',
          phone: item.business_owner_mobile_no || '-',
          branch: item.branch || '-',
          remarks:
            item.rejection_remarks ||
            item.reject_remarks ||
            item.rejection_reason ||
            item.reject_reason ||
            item.remarks ||
            '-',
          rejectedOn: item.rejected_date || item.updated_date || item.created_date || '-',
          rejectedBy: item.rejected_by || item.updated_by || item.created_by || '-',
        }))

      setLeads(rejectedLeads)
    } catch (fetchError) {
      console.error('Error fetching rejected leads:', fetchError)
      setError(
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        'Something went wrong while fetching rejected leads.',
      )
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchTimer = window.setTimeout(fetchRejectedLeads, 0)

    return () => window.clearTimeout(fetchTimer)
  }, [])

  const columns = [
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
    right: true,
  },
  {
    name: "Branch",
    selector: (row) => row.branch,
    sortable: true,
    right: true,
  },
  // {
  //   name: "Status",
  //   selector: (row) => row.status,
  //   sortable: true,
  //   center: true,
  //   cell: (row) => (
  //     <span
  //       className={`px-2 py-1 rounded-full text-xs font-medium ${
  //         row.status === "Approved"
  //           ? "bg-green-100 text-green-700"
  //           : row.status === "Pending"
  //           ? "bg-yellow-100 text-yellow-700"
  //           : row.status === "Rejected"
  //           ? "bg-red-100 text-red-700"
  //           : row.status === "Disbursed"
  //           ? "bg-blue-100 text-blue-700"
  //           : row.status === "Closed"
  //           ? "bg-gray-100 text-gray-700"
  //           : "bg-orange-100 text-orange-700"
  //       }`}
  //     >
  //       {row.status}
  //     </span>
  //   ),
  // },
  {
    name: "Remarks",
    selector: (row) => <span className='text-red-500 font-semibold'>{row.remarks}</span>,
    sortable: true,
  },
  {
    name: "Rejected On",
    selector: (row) => row.rejectedOn,
    sortable: true,
  },
  {
    name: "Rejected By",
    selector: (row) => row.rejectedBy,
    sortable: true,
  },
];

  return (
    <>
      <div className='flex-1'>
        {/* header  */}
        <div className="flex justify-between py-0 px-4">
          <div className="text-md font-medium self-center">Rejected Leads</div>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              setError('')
              fetchRejectedLeads()
            }}
            disabled={loading}
            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && !loading && (
          <div role="alert" className="px-4 py-2 mt-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* table data */}
        <Table data={leads} columns={columns} progressPending={loading} />

      </div>
    </>
  )
}

export default RejectedLeads