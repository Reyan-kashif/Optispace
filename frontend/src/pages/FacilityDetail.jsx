import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFacility();
  }, [id]);

  const fetchFacility = async () => {
    try {
      const res = await api.get(`/facilities/${id}`);
      if (res.data.success) {
        setFacility(res.data.data);
      } else {
        setError(res.data.message || 'Facility not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load facility');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Facility Details" />
        <main className="p-6">
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {facility && (
            <div className="max-w-2xl">
              <div className="border border-[#e5e7eb] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-[#1f2937] mb-4">{facility.facility_name}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">{facility.facility_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Capacity</p>
                    <p className="font-medium">{facility.capacity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">{facility.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium">{facility.is_available ? 'Available' : 'Unavailable'}</p>
                  </div>
                  {facility.dept_name && (
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium">{facility.dept_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {facility.equipment && facility.equipment.length > 0 && (
                <div className="border border-[#e5e7eb] rounded-lg p-6 mb-6">
                  <h3 className="text-base font-semibold text-[#1f2937] mb-3">Equipment</h3>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facility.equipment.map((eq) => (
                        <tr key={eq.equipment_id} className="border-b border-[#e5e7eb]">
                          <td className="px-4 py-2">{eq.equipment_name}</td>
                          <td className="px-4 py-2">{eq.equipment_type || '-'}</td>
                          <td className="px-4 py-2">{eq.quantity}</td>
                          <td className="px-4 py-2">{eq.condition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => navigate(`/book?facility=${facility.facility_id}`)}
                className="bg-[#2563eb] text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-blue-700"
              >
                Book This Facility
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
