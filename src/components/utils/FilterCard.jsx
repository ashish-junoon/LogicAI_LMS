import Icon from "./Icon";

const FilterCard = ({
  children,
  title = "Filters",
  className = "",
  handleFilterBtn
}) => {
  return (
    <div
      className={`w-full rounded-sm border border-gray-200 bg-white shadow-sm ${className} mt-3`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="text-sm font-semibold text-[#3E3E75]">
          {title}
        </h3>

        <button
        onClick={handleFilterBtn}
          className="cursor-pointer rounded-full border border-gray-200 hover:shadow p-2"
        >
          <Icon name="RiCloseLargeLine" size={15} color="black" />
        </button>
      </div>

      {/* Content */}
      <div className="border-t border-gray-200 p-5">
        {children}
      </div>
    </div>
  );
};

export default FilterCard;