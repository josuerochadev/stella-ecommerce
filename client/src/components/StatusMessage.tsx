import type { StatusMessageProps } from "@/utils/accessibility";

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, id }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "text-green-200 bg-green-900/60 border-green-700";
      case "error":
        return "text-red-200 bg-red-900/60 border-red-700";
      case "warning":
        return "text-yellow-200 bg-yellow-900/60 border-yellow-700";
      case "info":
        return "text-blue-200 bg-blue-900/60 border-blue-700";
      default:
        return "text-text bg-primary/20 border-primary";
    }
  };

  return (
    <div
      id={id}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`flex items-center p-3 rounded-md border ${getColors()}`}
    >
      <span className="mr-2" aria-hidden="true">
        {getIcon()}
      </span>
      <span>{message}</span>
    </div>
  );
};

export default StatusMessage;
