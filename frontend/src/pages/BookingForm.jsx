import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function BookingForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const preselectedFacility = searchParams.get('facility') || '';

    const [facilities, setFacilities] = useState([]);
    const [facilityId, setFacilityId] = useState(preselectedFacility);
    const [fetchingFacilities, setFetchingFacilities] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [loading, setLoading] = useState(false);
    const [attendeesCount, setAttendeesCount] = useState('');

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
            setFetchingFacilities(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!facilityId || !startTime || !endTime || !purpose || !attendeesCount) {
            setError('All fields are required');
            return;
        }

        if (new Date(startTime) < new Date()) {
            setError('Cannot book in the past. Please select a future date and time.');
            return;
        }

        if (new Date(endTime) <= new Date(startTime)) {
            setError('End time must be after start time');
            return;
        }

        setLoading(true);

        try {
            const availRes = await api.get('/facilities/available', {
                params: { start: startTime, end: endTime },
            });

            if (availRes.data.success) {
                const available = Array.isArray(availRes.data.data) ? availRes.data.data : [];
                const isAvailable = available.some(
                    (f) => String(f.facility_id) === String(facilityId)
                );

                if (!isAvailable) {
                    setError('Facility not available for this time slot. Please choose a different time or facility.');
                    setLoading(false);
                    return;
                }
            }

            const res = await api.post('/bookings', {
                facility_id: Number(facilityId),
                start_time: startTime,
                end_time: endTime,
                purpose,
                attendees_count: Number(attendeesCount),
            });

            if (res.data.success) {
                setSuccess('Booking submitted successfully!');
                setTimeout(() => navigate('/my-bookings'), 1500);
            } else {
                setError(res.data.message || 'Failed to submit booking');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Topbar title="Book a Facility" />
                <main className="p-6">
                    <div className="max-w-lg">
                        {error && (
                            <div className="mb-4 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-1">
                                    Facility
                                </label>
                                {fetchingFacilities ? (
                                    <p className="text-sm text-gray-400">Loading facilities...</p>
                                ) : (
                                    <>
                                        <select
                                            value={facilityId}
                                            onChange={(e) => setFacilityId(e.target.value)}
                                            required
                                            className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                                        >
                                            <option value="">Select a facility</option>
                                            {facilities.filter((f) => f.is_available).map((f) => (
                                                <option key={f.facility_id} value={f.facility_id}>
                                                    {f.facility_name} ({f.facility_type})
                                                </option>
                                            ))}
                                        </select>
                                        {facilityId && (() => {
                                            const selected = facilities.find((f) => String(f.facility_id) === String(facilityId));
                                            if (!selected) return null;
                                            return (
                                                <div className="mt-2 border border-[#e5e7eb] rounded-lg p-3 bg-gray-50">
                                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                                        <div>
                                                            <p className="text-gray-500">Type</p>
                                                            <p className="font-medium text-[#1f2937]">{selected.facility_type}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Capacity</p>
                                                            <p className="font-medium text-[#1f2937]">{selected.capacity}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Location</p>
                                                            <p className="font-medium text-[#1f2937]">{selected.location}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-1">
                                    Start Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-1">
                                    End Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-1">
                                    Purpose
                                </label>
                                <textarea
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb] resize-none"
                                    placeholder="Describe the purpose of your booking"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-1">
                                    Number of Attendees
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={attendeesCount}
                                    onChange={(e) => setAttendeesCount(e.target.value)}
                                    required
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                                    placeholder="e.g. 30"
                                />
                                {facilityId && attendeesCount && (() => {
                                    const selected = facilities.find((f) => String(f.facility_id) === String(facilityId));
                                    if (selected && Number(attendeesCount) > selected.capacity) {
                                        return (
                                            <p className="mt-1 text-xs text-amber-600">
                                                Warning: Attendees ({attendeesCount}) exceed facility capacity ({selected.capacity})
                                            </p>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2563eb] text-white text-sm font-medium py-2.5 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Booking'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}