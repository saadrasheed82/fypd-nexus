"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

export default function DocumentUploader({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    if (!fileName.endsWith(".pdf") && !fileName.endsWith(".docx")) {
      setError("Please upload a PDF or DOCX file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/student/parse-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Upload failed");
        setUploading(false);
        return;
      }

      onTextExtracted(data.text, data.fileName);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <UploadCloud className="mx-auto mb-4 text-slate-400" size={48} />
        <label className="cursor-pointer">
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
          <span className="text-sm font-semibold text-slate-700">Choose PDF or DOCX file</span>
        </label>
        <p className="mt-2 text-xs text-slate-500">Maximum file size: 5MB</p>
      </div>

      {file && (
        <div className="flex items-center justify-between rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-[#F34F1F]" size={24} />
            <div>
              <p className="text-sm font-semibold text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-xl bg-[#F34F1F] px-6 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 inline animate-spin" size={16} /> Parsing...
              </>
            ) : (
              "Parse Document"
            )}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

