import { useState, useEffect } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatusBadge from '../components/StatusBadge';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/mine');
      if (res.data.success) {
        setBookings(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(requestId);
    try {
      const res = await api.put(`/bookings/${requestId}/cancel`);
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.request_id === requestId ? { ...b, status: 'Cancelled' } : b))
        );
      } else {
        alert(res.data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="My Bookings" />
        <main className="p-6">
          {loading && <p className="text-gray-500">Loading bookings...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Facility</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Start</th>
                    <th className="px-4 py-3 font-medium text-gray-500">End</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Purpose</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Attendees</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.request_id} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">
                          {b.facility_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(b.start_time).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(b.end_time).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                          {b.purpose}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{b.attendees_count}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3">
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => handleCancel(b.request_id)}
                              disabled={cancelling === b.request_id}
                              className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                            >
                              {cancelling === b.request_id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
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
