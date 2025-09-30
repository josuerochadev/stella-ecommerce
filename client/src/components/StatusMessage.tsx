import { StatusMessageProps } from '../utils/accessibility';

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message, id }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'text-green-800 bg-green-100 border-green-300';
      case 'error': return 'text-red-800 bg-red-100 border-red-300';
      case 'warning': return 'text-yellow-800 bg-yellow-100 border-yellow-300';
      case 'info': return 'text-blue-800 bg-blue-100 border-blue-300';
      default: return 'text-text bg-primary/20 border-primary';
    }
  };

  return (
    <div
      id={id}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
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