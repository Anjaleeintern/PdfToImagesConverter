import { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import ImagePreview from "./components/ImagePreview";
import ProgressBar from "./components/ProgressBar";

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleConvert = async () => {
    if (!file) return alert("Upload PDF");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    setProgress(30);

    const res = await axios.post(
      `${API}/convert`,
      formData
    );

    setImages(res.data.images);
    setSelected([]);
    setDownloaded(false);
    setProgress(100);
    setLoading(false);
  };

  const toggleSelect = (img) => {
    setSelected(prev =>
      prev.includes(img)
        ? prev.filter(i => i !== img)
        : [...prev, img]
    );
  };

  const handleDownload = async () => {
    const res = await axios.post(
      `${API}/download-zip`,
      { images, selected }
    );

    const zipName = res.data.zipName;

    const link = document.createElement("a");
    link.href = `${API}/download/${zipName}`;
    link.download = zipName;
    link.click();

    setDownloaded(true);
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="w-full max-w-6xl">

      {/* ================= HEADER ================= */}
      <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-gray-800 mb-3 animate-fade-in">
  <img
    src="/pdficon image.jpg"
    alt="PDF to Image"
    className="w-16 h-16 transition-transform duration-300 hover:scale-110"
  />
  PDF to Images Converter
</h1>
      <p className="text-center text-gray-800 mb-10">
        Convert PDF pages into high-quality images instantly 🚀
      </p>

      {/* ================= UPLOAD CARD ================= */}
      <div className="bg-white rounded-2xl shadow-xl p-8 transition hover:shadow-2xl">
        {!images.length && (
          <>
            <FileUpload file={file} setFile={setFile} />

            <button
              onClick={handleConvert}
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition active:scale-95"
            >
              {loading ? "Converting..." : "Convert PDF"}
            </button>
          </>
        )}

        {loading && <ProgressBar progress={progress} />}

        <ImagePreview
          images={images}
          selected={selected}
          toggleSelect={toggleSelect}
          onDownload={handleDownload}
          downloaded={downloaded}
          apiUrl={API} 
        />
      </div>

      {/* ================= USE CASE CARDS ================= */}
      {!images.length && (
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Extract Pages",
              desc: "Convert PDF pages into images for presentations or sharing."
            },
            {
              title: "Easy Downloads",
              desc: "Select specific pages or download all images in one ZIP."
            },
            {
              title: "Fast & Secure",
              desc: "Files are processed locally and auto-deleted for privacy."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-bold mb-2 text-indigo-600">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <p className="text-center text-sm text-gray-500 mt-10">
        Built with ❤️ using React, Node.js & Tailwind CSS
      </p>

    </div>
  </div>
);
}

export default App;