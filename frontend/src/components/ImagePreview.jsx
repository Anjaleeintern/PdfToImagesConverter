const ImagePreview = ({
  images,
  selected,
  toggleSelect,
  onDownload,
  downloaded,
  apiUrl,
}) => {
  if (!images.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Converted Images</h2>
        <h3 className="text-xl font-semibold mb-6 text-blue-800">Select Images to Download</h3>


      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={img} className="relative border p-2 rounded">
            <input
              type="checkbox"
              checked={selected.includes(img)}
              onChange={() => toggleSelect(img)}
              className="absolute top-2 left-2"
            />
            <img src={`${apiUrl}${img}`} />
            <p className="text-center">Page {index + 1}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onDownload}
        disabled={selected.length === 0}
        className={`mt-8 w-full py-3 rounded-xl text-lg font-semibold transition
    ${
      selected.length === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 active:scale-95"
    }
  `}
      >
        {downloaded ? "Downloaded " : "Download ZIP"}
      </button>
    </div>
  );
};

export default ImagePreview;
