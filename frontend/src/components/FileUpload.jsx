

const FileUpload = ({ file, setFile }) => {
  return (
    <div className="mb-6">
      <label className="block border-2 border-dashed border-blue-600 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition">
        <input
          type="file"
          accept="application/pdf"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />

        <p className="font-medium text-gray-700">
          {file ? file.name : "Click to upload PDF"}
        </p>
      </label>
    </div>
  );
};

export default FileUpload;
