import { useState } from "react";
import Icon from "../utils/Icon";
import UploadDocuments from "./UploadDocuments";

const DocumentsList = ({ permission, documents = [], customerDetails, onRefresh }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const visibleDocuments = [
    ...documents,
    ...uploadedDocuments.filter(
      (uploadedDocument) =>
        !documents.some(
          (document) =>
            (uploadedDocument.id && document.id === uploadedDocument.id) ||
            document.document_path === uploadedDocument.document_path,
        ),
    ),
  ];

  const getFileIcon = (type) => {
    if (type === "PDF")
      return <Icon name="RiFilePdfLine" color="#5050b8" size={20} />;
    if (type === "JPG" || type === "PNG")
      return <Icon name="RiFileImageLine" color="green" size={20} />;
    return <Icon name="RiFileTextLine" color="#5050b8" size={20} />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-800">
          Uploaded Documents
        </h4>
        {permission && (
          // <button
          //   onClick={() => setOpen(true)}
          //   className="flex items-center gap-2 text-xs bg-primary/90 text-white px-3 py-1.5 rounded-md hover:bg-primary transition-colors font-semibold cursor-pointer"
          // >
          //   <Icon name={"RiUploadCloud2Line"} color="white" size={14} />
          //   Upload
          // </button>

          <UploadDocuments
            customerDetails={customerDetails}
            onRefresh={onRefresh}
            onUploaded={(document) =>
              setUploadedDocuments((currentDocuments) => [
                ...currentDocuments,
                document,
              ])
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {visibleDocuments.length === 0 ? (
          <p className="col-span-full py-6 text-center text-xs text-gray-500">
            No documents uploaded
          </p>
        ) : visibleDocuments.map((doc) => {
          const type =
            doc.file_extension?.toUpperCase() ||
            doc.document_path?.split(".").pop()?.split("?")[0]?.toUpperCase() ||
            "FILE";

          return (
          <div
            key={doc.id || doc.document_path}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(type)}
              <div>
                <p className="text-xs font-medium text-gray-800">{doc.document_type || "Document"}</p>
                <p className="text-[10px] text-gray-500">
                  {type} • {doc.created_date || "Date unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={doc.document_path} target="_blank" rel="noreferrer" aria-label={`View ${doc.document_type || "document"}`} className="p-1 text-gray-400 hover:text-primary/90 hover:bg-primary/5 rounded transition-colors">
                <Icon name="RiEyeLine" size={14} />
              </a>
              <a href={doc.document_path} download aria-label={`Download ${doc.document_type || "document"}`} className="p-1 text-gray-400 hover:text-primary/90 hover:bg-primary/5 rounded transition-colors">
                <Icon name={"RiDownloadLine"} size={14} />
              </a>
            </div>
          </div>
          );
        })}
      </div>

    </div>
  );
};

export default DocumentsList;
