import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const FACILITY_TYPES = ['All', 'Classroom', 'Lab', 'Seminar Hall', 'Sports Ground', 'Auditorium'];

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/facilities');
      if (res.data.success) {
        setFacilities(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Facilities" />
        <main className="p-6">
          {loading && <p className="text-gray-500">Loading facilities...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {FACILITY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${
                    filter === type
                      ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                      : 'bg-white text-[#1f2937] border-[#e5e7eb] hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {!loading && !error && (
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Capacity</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Equipment</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                        No facilities found
                      </td>
                    </tr>
                  ) : (
                    facilities
                      .filter((f) => filter === 'All' || f.facility_type === filter)
                      .map((f) => (
                      <tr
                        key={f.facility_id}
                        onClick={() => navigate(`/facilities/${f.facility_id}`)}
                        className="border-b border-[#e5e7eb] cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{f.facility_name}</td>
                        <td className="px-4 py-3 text-gray-600">{f.facility_type}</td>
                        <td className="px-4 py-3 text-gray-600">{f.capacity}</td>
                        <td className="px-4 py-3 text-gray-600">{f.location}</td>
                        <td className="px-4 py-3 text-gray-600">{f.equipment_count ?? 0}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              f.is_available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {f.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
