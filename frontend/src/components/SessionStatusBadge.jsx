import PropTypes from 'prop-types';

const statusConfig = {
  confirmed: {
    text: 'Confirmed',
    className: 'bg-blue-100 text-blue-800',
    icon: '✓'
  },
  pending: {
    text: 'Pending Confirmation',
    className: 'bg-yellow-100 text-yellow-800',
    icon: '⏱'
  },
  completed: {
    text: 'Completed',
    className: 'bg-green-100 text-green-800',
    icon: '✓',
    showEarnings: true
  },
  cancelled: {
    text: 'Cancelled',
    className: 'bg-red-100 text-red-800',
    icon: '✕'
  }
};

const SessionStatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    text: status,
    className: 'bg-gray-100 text-gray-800',
    icon: '?'
  };

  return (
    <div className="flex flex-col items-end">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    </div>
  );
};

SessionStatusBadge.propTypes = {
  status: PropTypes.oneOf(['confirmed', 'pending', 'completed', 'cancelled'])
};

export default SessionStatusBadge;