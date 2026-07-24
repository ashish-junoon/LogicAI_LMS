import { RiDownloadLine, RiEyeLine, RiFileImageLine, RiFilePdfLine, RiUploadCloud2Line } from "react-icons/ri";
import Icon from "../utils/Icon";

const DocumentsList = () => {
  const documents = [
    {
      id: 1,
      name: "Identity Proof (PAN Card)",
      type: "PDF",
      size: "2.4 MB",
      uploadedOn: "2024-01-16",
      status: "Verified",
    },
    {
      id: 2,
      name: "Address Proof",
      type: "JPG",
      size: "1.8 MB",
      uploadedOn: "2024-01-16",
      status: "Verified",
    },
    {
      id: 3,
      name: "Income Proof",
      type: "PDF",
      size: "3.2 MB",
      uploadedOn: "2024-01-17",
      status: "Pending",
    },
    {
      id: 4,
      name: "Bank Statement",
      type: "PDF",
      size: "5.1 MB",
      uploadedOn: "2024-01-18",
      status: "Verified",
    },
  ];

  const getFileIcon = (type) => {
    if (type === "PDF") return <Icon name="RiFilePdfLine" color="blue" size={20} />;
    if (type === "JPG" || type === "PNG") return <Icon name="RiFileImageLine"color="green" size={20} />;
    return <Icon name="RiFileTextLine" color="blue" size={20} />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-800">Uploaded Documents</h4>
        <button className="flex items-center gap-2 text-xs bg-primary/90 text-white px-3 py-1.5 rounded-lg hover:bg-primary transition-colors font-medium">
          <Icon name={"RiUploadCloud2Line"} color="white" size={14} />
          Upload
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(doc.type)}
              <div>
                <p className="text-xs font-medium text-gray-800">{doc.name}</p>
                <p className="text-[10px] text-gray-500">
                  {doc.type} • {doc.size}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                doc.status === "Verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {doc.status}
              </span>
              <button className="p-1 text-gray-400 hover:text-primary/90 hover:bg-primary/5 rounded transition-colors">
                <Icon name="RiEyeLine" size={14} />
              </button>
              <button className="p-1 text-gray-400 hover:text-primary/90 hover:bg-primary/5 rounded transition-colors">
                <Icon name={"RiDownloadLine"} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsList;