import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role_id: '',
    department_id: '',
    reg_number: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      if (res.data.success) {
        const userData = Array.isArray(res.data.data) ? res.data.data : [];
        setUsers(userData);

        const uniqueRoles = [];
        const roleMap = {};
        const uniqueDepts = [];
        const deptMap = {};

        userData.forEach((u) => {
          if (u.role_id && !roleMap[u.role_id]) {
            roleMap[u.role_id] = true;
            uniqueRoles.push({ role_id: u.role_id, role_name: u.role_name });
          }
          if (u.department_id && !deptMap[u.department_id]) {
            deptMap[u.department_id] = true;
            uniqueDepts.push({ department_id: u.department_id, dept_name: u.dept_name });
          }
        });

        if (uniqueRoles.length === 0) {
          setRoles([
            { role_id: 1, role_name: 'Admin' },
            { role_id: 2, role_name: 'Faculty' },
            { role_id: 3, role_name: 'Student' },
            { role_id: 4, role_name: 'Society Head' },
          ]);
        } else {
          setRoles(uniqueRoles);
        }

        if (uniqueDepts.length === 0) {
          setDepartments([
            { department_id: 1, dept_name: 'Faculty of Computer Science & Engineering' },
            { department_id: 2, dept_name: 'Faculty of Mechanical Engineering' },
            { department_id: 3, dept_name: 'Faculty of Materials & Chemical Engineering' },
            { department_id: 4, dept_name: 'Faculty of Business & Basic Sciences' },
            { department_id: 5, dept_name: 'Faculty of Biological Sciences' },
            { department_id: 6, dept_name: 'New Academic Block' },
          ]);
        } else {
          setDepartments(uniqueDepts);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role_id: parseInt(formData.role_id),
        department_id: formData.department_id ? parseInt(formData.department_id) : null,
        reg_number: formData.reg_number || null,
      };

      const res = await api.post('/users', payload);
      if (res.data.success) {
        setShowForm(false);
        setFormData({
          full_name: '',
          email: '',
          password: '',
          role_id: '',
          department_id: '',
          reg_number: '',
        });
        fetchUsers();
      } else {
        setFormError(res.data.message || 'Failed to create user');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        fetchUsers();
      } else {
        alert(res.data.message || 'Failed to deactivate user');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const handleActivate = async (userId) => {
    if (!window.confirm('Are you sure you want to activate this user?')) return;
    try {
      const res = await api.put(`/users/${userId}/activate`);
      if (res.data.success) {
        fetchUsers();
      } else {
        alert(res.data.message || 'Failed to activate user');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to activate user');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Manage Users" />
        <main className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#1f2937]">All Users</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? 'Close Form' : 'Add User'}
            </button>
          </div>

          {showForm && (
            <div className="border border-[#e5e7eb] rounded-lg p-6 mb-6 max-w-lg">
              <h4 className="text-sm font-semibold text-[#1f2937] mb-4">New User</h4>
              {formError && (
                <div className="mb-4 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddUser} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Full Name</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Role</label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="">Select role</option>
                    {roles.map((r) => (
                      <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Department</label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_id}>{d.dept_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Registration Number</label>
                  <input
                    name="reg_number"
                    value={formData.reg_number}
                    onChange={handleInputChange}
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#2563eb] text-white text-sm font-medium py-2.5 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          )}

          {loading && <p className="text-gray-500">Loading users...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Role</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Department</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Reg #</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.user_id} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{u.full_name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3 text-gray-600">{u.role_name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.dept_name || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{u.reg_number || '-'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              u.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.is_active ? (
                            <button
                              onClick={() => handleDeactivate(u.user_id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(u.user_id)}
                              className="text-xs text-green-600 hover:text-green-800 font-medium"
                            >
                              Activate
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
