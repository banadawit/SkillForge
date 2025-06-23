const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-50 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default EmptyState;