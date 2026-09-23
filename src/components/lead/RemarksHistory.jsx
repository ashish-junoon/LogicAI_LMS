import React, { useState } from "react";
import {
  RiChatHistoryLine,
  RiTimeLine,
  RiUser3Line,
  RiSearchLine,
} from "react-icons/ri";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import TextInput from '../fields/TextInput'
import SelectInput from '../fields/SelectInput'

const RemarksHistory = ({
  remarks = [],
  className = "",
  maxHeight = "400px",
  permission = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Default mock data
  const defaultRemarks = [
    {
      id: 1,
      status: "Completed",
      step: "KYC Verification",
      remark: "All KYC documents verified successfully",
      description:
        "Customer's PAN, Aadhar, and address proof verified and approved",
      processedBy: "Rahul Sharma",
      processedOn: "2024-01-20 10:30 AM",
    },
    {
      id: 2,
      status: "In Progress",
      step: "Document Review",
      remark: "Income documents under review",
      description:
        "Salary slips and bank statements being verified by credit team",
      processedBy: "Priya Patel",
      processedOn: "2024-01-19 03:45 PM",
    },
    {
      id: 3,
      status: "Pending",
      step: "Video KYC",
      remark: "Video KYC pending - Customer not available",
      description:
        "Customer has been contacted 3 times for video KYC, no response received",
      processedBy: "Amit Kumar",
      processedOn: "2024-01-18 09:15 AM",
    },
    {
      id: 6,
      status: "On Hold",
      step: "Document Collection",
      remark: "Awaiting additional documents from customer",
      description:
        "Customer needs to submit latest 3 months bank statements and IT returns",
      processedBy: "Neha Gupta",
      processedOn: "2024-01-15 04:30 PM",
    },
  ];

  const remarkData = remarks.length > 0 ? remarks : defaultRemarks;

  // Filter and search remarks
  const getFilteredRemarks = () => {
    let filtered = remarkData;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.status.toLowerCase().includes(term) ||
          r.step.toLowerCase().includes(term) ||
          r.remark.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.processedBy.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  const filteredRemarks = getFilteredRemarks();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex justify-between items-center w-full">
          <div className="relative">
            <RiSearchLine
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-2">
          {permission && <Button
            btnName={"Add Remarks"}
            btnIcon={"IoAddCircleOutline"}
            onClick={()=> setOpen(true)}
            // btnIcon={"IoAdd"}
            style={"bg-primary text-white text-sm font-medium py-0 rounded-lg"}
          />}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-auto rounded-lg border border-gray-200 no-scrollbar"
        style={{ maxHeight }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Step
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Remark
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-nowrap">
                Processed By
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-nowrap">
                Processed On
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRemarks.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  <RiChatHistoryLine className="mx-auto text-gray-300 text-3xl mb-2" />
                  No remarks found matching your criteria
                </td>
              </tr>
            ) : (
              filteredRemarks.map((remark) => {

                return (
                  <tr
                    key={remark.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-800">
                        {remark.step}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-800 font-medium">
                        {remark.remark}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 line-clamp-2">
                        {remark.description}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <RiUser3Line className="text-gray-400" size={12} />
                        <span className="text-xs text-gray-700">
                          {remark.processedBy}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <RiTimeLine className="text-gray-400" size={12} />
                        <span className="text-xs text-gray-600">
                          {remark.processedOn}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>
          Showing {filteredRemarks.length} of {remarkData.length} entries
        </span>
        {searchTerm && <span>Search results for: "{searchTerm}"</span>}
      </div>

      <Modal
        isOpen={open}
        onClose={()=> setOpen(false)}
        title={"Add Remarks"}
      >
        <div className="grid grid-cols-2 gap-2 my-3">
          <SelectInput placeholder={"Select Remark"} options={[{label: "Remark 1", value: "Remark 1"}, {label: "Remark 2", value: "Remark 2"}]} label="Remark" />
          <TextInput label="Description" />
        </div>

        <div className="flex gap-1 items-center justify-end">
          <Button btnName={"Cancel"} style={"border border-gray-200"} />
          <Button btnName={"Submit"} style={"bg-primary text-white"} />
        </div>
      </Modal>
    </div>
  );
};

export default RemarksHistory;
