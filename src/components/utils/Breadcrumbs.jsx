import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";

// items: [{ label, path? }] — the last item is rendered as plain text (current page)
export default function Breadcrumbs({ items }) {
  const navigate = useNavigate();

  return (
    <>
      <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
        {items.map((item, i) => (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <FiChevronRight size={11} />}
            {item.path && i !== items.length - 1 ? (
              <Link to={item.path} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  i === items.length - 1 ? "font-medium text-gray-500" : ""
                }
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
      >
        <FiArrowLeft size={15} /> Back
      </button>
    </>
  );
}
