function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-indigo-50 text-[#635bff]">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;