import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import gikiLogo from '../assets/giki-logo.png';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'Admin';

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Manage Users' },
    { to: '/admin/facilities', label: 'Manage Facilities' },
    { to: '/admin/approvals', label: 'Approval Queue' },
    { to: '/admin/booking-history', label: 'Booking History' },
    { to: '/admin/analytics', label: 'Analytics' },
    { to: '/recommendations', label: 'Recommendations' },
  ];

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/book', label: 'Book a Facility' },
    { to: '/my-bookings', label: 'My Bookings' },
    { to: '/recommendations', label: 'Recommendations' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm rounded ${
      isActive
        ? 'bg-white/10 text-white font-medium'
        : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#1e3a5f] flex flex-col z-20">
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={gikiLogo} alt="GIK Institute" className="h-9" />
          <span className="text-white text-xs leading-tight font-medium">Ghulam Ishaq Khan<br/>Institute</span>
        </div>
        <p className="text-white text-lg font-bold tracking-tight mt-2">OptiSpace</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="mb-3">
          <p className="text-white text-sm font-medium truncate">{user?.full_name}</p>
          <p className="text-gray-400 text-xs">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-300 hover:text-white px-2 py-1.5 rounded hover:bg-white/5"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
