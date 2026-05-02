import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function ManageFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    facility_name: '',
    facility_type: '',
    capacity: '',
    location: '',
    department_id: '',
    is_available: true,
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/facilities');
      if (res.data.success) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setFacilities(data);

        const deptMap = {};
        const uniqueDepts = [];
        data.forEach((f) => {
          if (f.department_id && !deptMap[f.department_id]) {
            deptMap[f.department_id] = true;
            uniqueDepts.push({ department_id: f.department_id, dept_name: f.dept_name });
          }
        });
        setDepartments(uniqueDepts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      facility_name: '',
      facility_type: '',
      capacity: '',
      location: '',
      department_id: '',
      is_available: true,
    });
    setEditingId(null);
    setFormError('');
  };

  const handleEdit = (facility) => {
    setFormData({
      facility_name: facility.facility_name || '',
      facility_type: facility.facility_type || '',
      capacity: facility.capacity || '',
      location: facility.location || '',
      department_id: facility.department_id || '',
      is_available: facility.is_available !== false,
    });
    setEditingId(facility.facility_id);
    setShowForm(true);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'is_available') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const payload = {
      facility_name: formData.facility_name,
      facility_type: formData.facility_type,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      department_id: formData.department_id ? parseInt(formData.department_id) : null,
      is_available: formData.is_available,
    };

    try {
      let res;
      if (editingId) {
        res = await api.put(`/facilities/${editingId}`, payload);
      } else {
        res = await api.post('/facilities', payload);
      }

      if (res.data.success) {
        setShowForm(false);
        resetForm();
        fetchFacilities();
      } else {
        setFormError(res.data.message || 'Operation failed');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (facilityId) => {
    if (!window.confirm('Are you sure you want to remove this facility?')) return;
    try {
      const res = await api.delete(`/facilities/${facilityId}`);
      if (res.data.success) {
        fetchFacilities();
      } else {
        alert(res.data.message || 'Failed to remove facility');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove facility');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Manage Facilities" />
        <main className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#1f2937]">All Facilities</h3>
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  resetForm();
                } else {
                  resetForm();
                  setShowForm(true);
                }
              }}
              className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? 'Close Form' : 'Add Facility'}
            </button>
          </div>

          {showForm && (
            <div className="border border-[#e5e7eb] rounded-lg p-6 mb-6 max-w-lg">
              <h4 className="text-sm font-semibold text-[#1f2937] mb-4">
                {editingId ? 'Edit Facility' : 'New Facility'}
              </h4>
              {formError && (
                <div className="mb-4 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Name</label>
                  <input
                    name="facility_name"
                    value={formData.facility_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Type</label>
                  <select
                    name="facility_type"
                    value={formData.facility_type}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="">Select type</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Lab">Lab</option>
                    <option value="Seminar Hall">Seminar Hall</option>
                    <option value="Sports Ground">Sports Ground</option>
                    <option value="Auditorium">Auditorium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Capacity</label>
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Department</label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="">No department</option>
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_id}>{d.dept_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Status</label>
                  <select
                    name="is_available"
                    value={formData.is_available.toString()}
                    onChange={handleInputChange}
                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#2563eb] text-white text-sm font-medium py-2.5 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving...'
                    : editingId
                    ? 'Update Facility'
                    : 'Create Facility'}
                </button>
              </form>
            </div>
          )}

          {loading && <p className="text-gray-500">Loading facilities...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Capacity</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                        No facilities found
                      </td>
                    </tr>
                  ) : (
                    facilities.map((f) => (
                      <tr key={f.facility_id} className="border-b border-[#e5e7eb]">
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{f.facility_name}</td>
                        <td className="px-4 py-3 text-gray-600">{f.facility_type}</td>
                        <td className="px-4 py-3 text-gray-600">{f.capacity}</td>
                        <td className="px-4 py-3 text-gray-600">{f.location}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              f.is_available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {f.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-4 py-3 space-x-3">
                          <button
                            onClick={() => handleEdit(f)}
                            className="text-xs text-[#2563eb] hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(f.facility_id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
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
