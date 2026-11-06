import { useState } from "react";
import { RiSearchLine, RiTimeLine, RiUser3Line } from "react-icons/ri";

// const sampleVariations = [
//   {
//     id: "sample-1",
//     field: "Requested Loan Amount",
//     currentValue: "₹2,50,000",
//     previousValue: "₹2,00,000",
//     updatedBy: "Amit Sharma",
//     updatedAt: "22 Oct 2026, 10:30 AM",
//   },
//   {
//     id: "sample-2",
//     field: "Employment Type",
//     currentValue: "Self-employed",
//     previousValue: "Salaried",
//     updatedBy: "Neha Verma",
//     updatedAt: "21 Oct 2026, 3:15 PM",
//   },
//   {
//     id: "sample-3",
//     field: "Residential Address",
//     currentValue: "Andheri East, Mumbai",
//     previousValue: "Borivali West, Mumbai",
//     updatedBy: "Amit Sharma",
//     updatedAt: "20 Oct 2026, 11:05 AM",
//   },
// ];

const sampleVariations = []

const Variations = ({
  variations = [],
  className = "",
  maxHeight = "400px",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const hasApiVariations = Array.isArray(variations) && variations.length > 0;
  const variationData = (hasApiVariations ? variations : sampleVariations).map(
    (item, index) => ({
      id: item.id ?? `variation-${index}`,
      field: item.field ?? item.field_name ?? item.changed_field ?? "—",
      currentValue:
        item.currentValue ??
        item.current_value ??
        item.new_value ??
        item.newValue ??
        "—",
      previousValue:
        item.previousValue ??
        item.previous_value ??
        item.old_value ??
        item.oldValue ??
        "—",
      updatedBy: item.updatedBy ?? item.updated_by ?? "—",
      updatedAt: item.updatedAt ?? item.updated_date ?? item.updated_at ?? "—",
    }),
  );

  const search = searchTerm.trim().toLowerCase();
  const filteredVariations = variationData.filter((variation) =>
    [
      variation.field,
      variation.currentValue,
      variation.previousValue,
      variation.updatedBy,
      variation.updatedAt,
    ].some((value) => String(value).toLowerCase().includes(search)),
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* {!hasApiVariations && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Showing sample variation data until change history is available.
        </p>
      )} */}

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <RiSearchLine
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
          <input
            type="search"
            aria-label="Search variations"
            placeholder="Search variations..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div
        className="overflow-auto rounded-lg border border-gray-200 no-scrollbar"
        style={{ maxHeight }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Field
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Current Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Previous Value
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Updated By
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredVariations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No variations found.
                </td>
              </tr>
            ) : (
              filteredVariations.map((variation) => (
                <tr
                  key={variation.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-800">
                    {variation.field}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">
                    {variation.currentValue}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {variation.previousValue}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <RiUser3Line className="text-gray-400" size={12} />
                      {variation.updatedBy}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <RiTimeLine className="text-gray-400" size={12} />
                      {variation.updatedAt}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-gray-400">
        Showing {filteredVariations.length} of {variationData.length} entries
      </div>
    </div>
  );
};

export default Variations;
