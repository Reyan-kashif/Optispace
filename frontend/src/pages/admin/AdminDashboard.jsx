import { Navigate } from 'react-router-dom';

// Admin dashboard redirects to main Dashboard which handles role-based content
export default function AdminDashboard() {
  return <Navigate to="/dashboard" replace />;
}
