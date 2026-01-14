const ProgressBar = ({ progress }) => {
  return (
    <div className="mt-4">
      <div className="h-3 bg-gray-300 rounded">
        <div
          className="h-3 bg-green-500 rounded transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1 text-center">
        Processing... {progress}%
      </p>
    </div>
  );
};

export default ProgressBar;
