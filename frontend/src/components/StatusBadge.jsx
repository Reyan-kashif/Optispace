export default function StatusBadge({ status }) {
  const colorMap = {
    Approved: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Rejected: 'bg-red-100 text-red-700',
    Cancelled: 'bg-gray-100 text-gray-500',
  };

  const dotColorMap = {
    Approved: 'bg-[#16a34a]',
    Pending: 'bg-[#ca8a04]',
    Rejected: 'bg-[#dc2626]',
    Cancelled: 'bg-[#6b7280]',
  };

  const classes = colorMap[status] || 'bg-gray-100 text-gray-500';
  const dotClass = dotColorMap[status] || 'bg-[#6b7280]';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      {status}
    </span>
  );
}
