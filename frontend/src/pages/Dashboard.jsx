import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BookingCard from '../components/BookingCard';

export default function Dashboard() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Topbar title="Dashboard" />
                <main className="p-6">
                    {isAdmin ? <AdminDashboardContent /> : <UserDashboardContent />}
                </main>
            </div>
        </div>
    );
}

function AdminDashboardContent() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFacilities: 0,
        pendingRequests: 0,
        activeBookings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersRes, facilitiesRes, pendingRes, activeRes] = await Promise.all([
                api.get('/users'),
                api.get('/facilities'),
                api.get('/bookings/pending'),
                api.get('/bookings/active'),
            ]);
            setStats({
                totalUsers: Array.isArray(usersRes.data.data) ? usersRes.data.data.length : 0,
                totalFacilities: Array.isArray(facilitiesRes.data.data) ? facilitiesRes.data.data.length : 0,
                pendingRequests: Array.isArray(pendingRes.data.data) ? pendingRes.data.data.length : 0,
                activeBookings: Array.isArray(activeRes.data.data) ? activeRes.data.data.length : 0,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    const cards = [
        { label: 'Total Users', value: stats.totalUsers, color: 'border-l-[#2563eb]' },
        { label: 'Total Facilities', value: stats.totalFacilities, color: 'border-l-[#16a34a]' },
        { label: 'Pending Requests', value: stats.pendingRequests, color: 'border-l-[#f59e0b]' },
        { label: 'Active Bookings', value: stats.activeBookings, color: 'border-l-[#dc2626]' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className={`border border-[#e5e7eb] border-l-4 ${card.color} rounded-lg p-5 shadow-sm`}>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{card.label}</p>
                        <p className="text-2xl font-bold text-[#1f2937]">{card.value}</p>
                    </div>
                ))}
            </div>
            <RecentActivity />
        </div>
    );
}

function RecentActivity() {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            const res = await api.get('/bookings/history');
            if (res.data.success) {
                setActivity(Array.isArray(res.data.data) ? res.data.data.slice(0, 5) : []);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-sm text-gray-400">Loading activity...</p>;
    if (activity.length === 0) return null;

    return (
        <div>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Recent Activity</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-500">Requester</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Facility</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Decided By</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activity.map((a) => (
                            <tr key={a.request_id} className="border-b border-[#e5e7eb] hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-[#1f2937]">{a.requester}</td>
                                <td className="px-4 py-3 text-gray-600">{a.facility_name}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium ${a.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {a.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{a.decided_by || '-'}</td>
                                <td className="px-4 py-3 text-gray-600">
                                    {a.action_taken_at ? new Date(a.action_taken_at).toLocaleDateString() : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UserDashboardContent() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const approved = bookings.filter((b) => b.status === 'Approved').length;
    const upcoming = bookings.filter(
        (b) => b.status === 'Approved' && new Date(b.start_time) > new Date()
    );

    const statCards = [
        { label: 'Total Bookings', value: bookings.length, color: 'border-l-[#2563eb]' },
        { label: 'Pending', value: pending, color: 'border-l-[#f59e0b]' },
        { label: 'Approved', value: approved, color: 'border-l-[#16a34a]' },
        { label: 'Upcoming', value: upcoming.length, color: 'border-l-[#8b5cf6]' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className={`border border-[#e5e7eb] border-l-4 ${card.color} rounded-lg p-5 shadow-sm`}>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{card.label}</p>
                        <p className="text-2xl font-bold text-[#1f2937]">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}