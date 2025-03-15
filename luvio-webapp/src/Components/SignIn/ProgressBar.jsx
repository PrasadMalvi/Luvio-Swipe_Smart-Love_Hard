const ProgressBar = ({ step }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div
        className={`h-2 bg-[#b25776] rounded-full`}
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  );
};
export default ProgressBar;
