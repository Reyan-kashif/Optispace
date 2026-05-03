export default function FacilityCard({ facility, onClick }) {
  return (
    <div
      onClick={onClick}
      className="border border-[#e5e7eb] rounded-lg p-4 cursor-pointer hover:border-accent"
    >
      <h3 className="text-sm font-semibold text-[#1f2937] mb-1">{facility.name}</h3>
      <p className="text-xs text-gray-500 mb-1">{facility.type} &middot; Capacity: {facility.capacity}</p>
      <p className="text-xs text-gray-500">{facility.location}</p>
      {facility.equipment_count !== undefined && (
        <p className="text-xs text-gray-400 mt-1">{facility.equipment_count} equipment item(s)</p>
      )}
    </div>
  );
}
