
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadZipFromUrl = async (
  url,
  {
    downloadAll = false,
    zipName = "download.zip",
    headers = {},
    onSuccess,
    onError,
  } = {}
) => {
  try {
    if (!url) {
      throw new Error("ZIP URL is required");
    }

    // Fetch ZIP from URL
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ZIP: ${response.status}`);
    }

    // Convert response to ArrayBuffer
    const zipData = await response.arrayBuffer();

    // Extract ZIP
    const zip = await JSZip.loadAsync(zipData);

    const extractedFiles = [];

    for (const [fileName, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir) continue;

      const blob = await zipEntry.async("blob");

      extractedFiles.push({
        name: fileName,
        blob,
      });
    }

    if (!extractedFiles.length) {
      throw new Error("No files found in ZIP");
    }

    if (downloadAll) {
      // Download all extracted files in one ZIP
      const newZip = new JSZip();

      extractedFiles.forEach(({ name, blob }) => {
        newZip.file(name, blob);
      });

      const output = await newZip.generateAsync({
        type: "blob",
      });

      saveAs(output, zipName);
    } else {
      // Download individual files
      extractedFiles.forEach(({ name, blob }) => {
        saveAs(blob, name.split("/").pop());
      });
    }

    onSuccess?.(extractedFiles);

    return extractedFiles;
  } catch (error) {
    console.error("ZIP download error:", error);

    onError?.(error);

    throw error;
  }
};
