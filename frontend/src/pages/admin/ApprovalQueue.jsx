import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusBadge from '../../components/StatusBadge';

export default function ApprovalQueue() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchPending();
  }, []);



  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await api.put(`/bookings/${requestId}/approve`);
      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b.request_id !== requestId));
      } else {
        alert(res.data.message || 'Failed to approve booking');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!remarks.trim()) {
      alert('Please provide remarks for the rejection');
      return;
    }
    setActionLoading(requestId);
    try {
      const res = await api.put(`/bookings/${requestId}/reject`, { remarks });
      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b.request_id !== requestId));
        setRejectId(null);
        setRemarks('');
      } else {
        alert(res.data.message || 'Failed to reject booking');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Approval Queue" />
        <main className="p-6">
          {loading && <p className="text-gray-500">Loading pending requests...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="border border-[#e5e7eb] rounded-lg overflow-x-auto">
              <table className="w-full text-sm text-left table-fixed min-w-[900px]">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">Requested By</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">Facility</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">Start</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[12%]">End</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[20%]">Purpose</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[7%]">Attendees</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[8%]">Status</th>
                    <th className="px-3 py-3 font-medium text-gray-500 w-[17%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                        No pending requests
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.request_id} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">
                          {b.full_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
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
                          {rejectId === b.request_id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Rejection remarks"
                                className="w-full border border-[#e5e7eb] rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2563eb]"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReject(b.request_id)}
                                  disabled={actionLoading === b.request_id}
                                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectId(null);
                                    setRemarks('');
                                  }}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(b.request_id)}
                                disabled={actionLoading === b.request_id}
                                className="text-xs bg-[#16a34a] text-white px-2.5 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectId(b.request_id);
                                  setRemarks('');
                                }}
                                className="text-xs bg-[#dc2626] text-white px-2.5 py-1 rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
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
