import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function Analytics() {
  const [utilization, setUtilization] = useState([]);
  const [byDay, setByDay] = useState([]);
  const [byType, setByType] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [byDepartment, setByDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [utilRes, dayRes, typeRes, usersRes, monthlyRes, deptRes] =
        await Promise.all([
          api.get('/analytics/utilization').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/by-day').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/by-type').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/active-users').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/monthly').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/by-department').catch(() => ({ data: { data: [] } })),
        ]);

      setUtilization(Array.isArray(utilRes.data.data) ? utilRes.data.data : []);
      setByDay(Array.isArray(dayRes.data.data) ? dayRes.data.data : []);
      setByType(Array.isArray(typeRes.data.data) ? typeRes.data.data : []);
      setActiveUsers(Array.isArray(usersRes.data.data) ? usersRes.data.data : []);
      setMonthly(Array.isArray(monthlyRes.data.data) ? monthlyRes.data.data : []);
      setByDepartment(Array.isArray(deptRes.data.data) ? deptRes.data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar title="Analytics" />
          <main className="p-6">
            <p className="text-gray-500">Loading analytics...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Analytics" />
        <main className="p-6 space-y-8">
          {error && <p className="text-red-600">{error}</p>}

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Facility Utilization</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Facility</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Capacity</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Minutes Used</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Utilization %</th>
                  </tr>
                </thead>
                <tbody>
                  {utilization.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    utilization.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.facility_name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.facility_type}</td>
                        <td className="px-4 py-3 text-gray-600">{row.capacity}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_minutes_used}</td>
                        <td className="px-4 py-3 text-gray-600">{row.utilization_pct || '0'}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Bookings by Day of Week</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Day</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {byDay.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    byDay.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.day_of_week}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_duration}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Bookings by Facility Type</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Duration (min)</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Avg Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {byType.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    byType.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.facility_type}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_duration}</td>
                        <td className="px-4 py-3 text-gray-600">{row.avg_duration}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Most Active Users</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Role</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Department</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    activeUsers.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.full_name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.role_name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.dept_name || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Monthly Report</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Month</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Duration (min)</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Facilities Used</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    monthly.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.month}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_duration}</td>
                        <td className="px-4 py-3 text-gray-600">{row.facilities_used}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1f2937] mb-3">Bookings by Department</h3>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Department</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Bookings</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Total Duration (min)</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Facilities Used</th>
                  </tr>
                </thead>
                <tbody>
                  {byDepartment.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    byDepartment.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{row.dept_name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_bookings}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total_duration}</td>
                        <td className="px-4 py-3 text-gray-600">{row.facilities_used}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
