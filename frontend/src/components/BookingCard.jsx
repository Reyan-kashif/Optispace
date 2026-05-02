import StatusBadge from './StatusBadge';

export default function BookingCard({ booking }) {
  const start = new Date(booking.start_time).toLocaleString();
  const end = new Date(booking.end_time).toLocaleString();

  return (
    <div className="border border-[#e5e7eb] rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#1f2937]">
          {booking.facility_name || `Facility #${booking.facility_id}`}
        </h3>
        <StatusBadge status={booking.status} />
      </div>
      <p className="text-xs text-gray-500 mb-1">
        {start} &mdash; {end}
      </p>
      {booking.purpose && (
        <p className="text-xs text-gray-600">{booking.purpose}</p>
      )}
    </div>
  );
}
