import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusBadge from '../../components/StatusBadge';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/bookings/history');
      if (res.data.success) {
        setBookings(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Booking History" />
        <main className="p-6">
          {loading && <p className="text-gray-500">Loading history...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              <div className="flex gap-2 mb-4">
                {['All', 'Approved', 'Rejected'].map((type) => (
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

              <div className="border border-[#e5e7eb] rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left table-fixed min-w-[1100px]">
                  <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                    <tr>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[10%]">Requester</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">Facility</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">Start</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">End</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[16%]">Purpose</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[8%]">Status</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[10%]">Decided By</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[14%]">Remarks</th>
                      <th className="px-3 py-3 font-medium text-gray-500 w-[10%]">Decision Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                          No booking records found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((b) => (
                        <tr key={b.request_id} className="border-b border-[#e5e7eb]">
                          <td className="px-3 py-3 font-medium text-[#1f2937]">{b.requester}</td>
                          <td className="px-3 py-3 text-gray-600">{b.facility_name}</td>
                          <td className="px-3 py-3 text-gray-600">
                            {new Date(b.start_time).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {new Date(b.end_time).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 text-gray-600 truncate">{b.purpose}</td>
                          <td className="px-3 py-3">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-3 py-3 text-gray-600">{b.decided_by || '-'}</td>
                          <td className="px-3 py-3 text-gray-600 truncate">{b.remarks || '-'}</td>
                          <td className="px-3 py-3 text-gray-600">
                            {b.action_taken_at
                              ? new Date(b.action_taken_at).toLocaleString()
                              : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
