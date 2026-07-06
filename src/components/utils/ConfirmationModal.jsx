import { useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";

const ConfirmationModal = ({
  isOpen,
  onClose,
  children,
  width = "max-w-2xl",
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${width} bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer transition flex items-center justify-center"
        >
          <RiCloseLine size={22} />
        </button>

        {/* Content */}
        <div className="p-0 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;