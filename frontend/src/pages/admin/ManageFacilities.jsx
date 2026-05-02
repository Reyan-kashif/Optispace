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


}
