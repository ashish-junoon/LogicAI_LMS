import React from "react";
// import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

const DownloadDoc = ({ fileUrl, fileType, fileName, btnName="View document", label, disabled = false }) => {
    // const handleDownload = async (e) => {
    //     e.preventDefault(); // Prevent form submission
    //     try {
    //         if (!fileUrl) {
    //             throw new Error("No file URL provided");
    //         }

    //         const response = await fetch(fileUrl);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch the file");
    //         }

    //         const blob = await response.blob();
    //         const type = fileType || blob.type || "application/octet-stream";
    //         const finalBlob = new Blob([blob], { type });

    //         saveAs(finalBlob, fileName || "download");
    //     } catch (error) {
    //         console.error("Error downloading file:", error);
    //     }
    // };
// console.log("fileUrl", fileUrl);
    return (
        <>
            <span className="block mb-0.5 text-sm font-medium text-gray-800">{label}</span>
            <div className="flex justify-center items-center">
                <a
                    href={fileUrl}
                    target="_blank"
                    download
                    className="text-xs border border-gray-300 text-gray-700 py-2 px-4 w-full rounded-md"
                >
                    {btnName}
                </a>
            </div>
        </>
    );
};

export default DownloadDoc;
