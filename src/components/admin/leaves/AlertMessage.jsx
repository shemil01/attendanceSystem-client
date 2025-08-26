import { CheckCircle, AlertCircle } from "lucide-react";

const AlertMessage = ({ type, message }) => {
  const isError = type === "error";

  return (
    <div
      className={`mb-6 rounded-lg p-4 flex items-center border ${
        isError
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      {isError ? (
        <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
      ) : (
        <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
