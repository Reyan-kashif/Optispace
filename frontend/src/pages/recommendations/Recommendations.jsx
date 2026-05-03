import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function Recommendations() {
  const [leastUsed, setLeastUsed] = useState([]);
  const [byDepartment, setByDepartment] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [bestSlots, setBestSlots] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [nextSlots, setNextSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      const [leastRes, deptRes, facRes] = await Promise.all([
        api.get('/recommendations/least-used').catch(() => ({ data: { data: [] } })),
        api.get('/recommendations/by-department').catch(() => ({ data: { data: [] } })),
        api.get('/facilities').catch(() => ({ data: { data: [] } })),
      ]);

      setLeastUsed(Array.isArray(leastRes.data.data) ? leastRes.data.data : []);
      setByDepartment(Array.isArray(deptRes.data.data) ? deptRes.data.data : []);
      setFacilities(Array.isArray(facRes.data.data) ? facRes.data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleFacilitySelect = async (facilityId) => {
    setSelectedFacility(facilityId);
    if (!facilityId) {
      setBestSlots([]);
      setSimilar([]);
      setNextSlots([]);
      return;
    }

    setSlotsLoading(true);
    try {
      const [slotsRes, similarRes, nextRes] = await Promise.all([
        api.get(`/recommendations/best-slots/${facilityId}`).catch(() => ({ data: { data: [] } })),
        api.get(`/recommendations/similar/${facilityId}`).catch(() => ({ data: { data: [] } })),
        api.get(`/recommendations/next-slot/${facilityId}`).catch(() => ({ data: { data: [] } })),
      ]);

      setBestSlots(Array.isArray(slotsRes.data.data) ? slotsRes.data.data : []);
      setSimilar(Array.isArray(similarRes.data.data) ? similarRes.data.data : []);
      const nextData = nextRes.data.data;
      setNextSlots(Array.isArray(nextData) ? nextData : nextData ? [nextData] : []);
    } catch (err) {
      // errors caught individually above
    } finally {
      setSlotsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Recommendations" />
          <main className="p-6">
            <p className="text-gray-500">Loading recommendations...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Recommendations" />
        <main className="p-6 space-y-8">
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Least Used Facilities</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Facility</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Capacity</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Minutes Used</th>
                  </tr>
                </thead>
                <tbody>
                  {leastUsed.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    leastUsed.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.facility_name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.facility_type}</td>
                        <td className="px-4 py-3 text-gray-600">{row.capacity}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_minutes_used}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Department Recommendations</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Facility</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Minutes</th>
                  </tr>
                </thead>
                <tbody>
                  {byDepartment.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No data for your department</td>
                    </tr>
                  ) : (
                    byDepartment.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.facility_name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.facility_type}</td>
                        <td className="px-4 py-3 text-gray-600">{row.location}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_minutes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Facility-Specific Recommendations</h3>
            <div className="mb-4 max-w-sm">
              <label className="block text-sm font-medium text-[#1f2937] mb-1">Select a Facility</label>
              <select
                value={selectedFacility}
                onChange={(e) => handleFacilitySelect(e.target.value)}
                className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
              >
                <option value="">Choose facility...</option>
                {Object.entries(
                  facilities.reduce((groups, f) => {
                    const type = f.facility_type || 'Other';
                    if (!groups[type]) groups[type] = [];
                    groups[type].push(f);
                    return groups;
                  }, {})
                ).map(([type, items]) => (
                  <optgroup key={type} label={type}>
                    {items.map((f) => (
                      <option key={f.facility_id} value={f.facility_id}>{f.facility_name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {slotsLoading && <p className="text-gray-500 text-sm">Loading...</p>}

          
          </section>
        </main>
      </div>
    </div>
  );
}
