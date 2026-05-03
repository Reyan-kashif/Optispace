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

  const fetchPending = async () => {
    try {
      const res = await api.get('/bookings/pending');
      if (res.data.success) {
        setBookings(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending bookings');
    } finally {
      setLoading(false);
    }
  };

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


}
