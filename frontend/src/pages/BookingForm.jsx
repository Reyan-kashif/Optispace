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
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}