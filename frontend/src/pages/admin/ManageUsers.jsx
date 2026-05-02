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

 
}
