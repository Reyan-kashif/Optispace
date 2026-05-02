import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import campusBg from '../assets/campus-bg.png';
import gikiLogo from '../assets/giki-logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${campusBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
      <div className="relative z-10 w-full max-w-sm bg-white border border-[#e5e7eb] rounded-lg p-8 shadow-xl">
        <div className="flex justify-center mb-4">
          <img src={gikiLogo} alt="GIK Institute" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold text-[#1e3a5f] text-center mb-1">OptiSpace</h1>
        <p className="text-sm text-gray-500 text-center mb-1">
          Smart Campus Facility Booking
        </p>
        <p className="text-xs text-gray-400 text-center mb-6">
          GIK Institute of Engineering Sciences & Technology
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1f2937] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
              placeholder="you@university.edu"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1f2937] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563eb] text-white text-sm font-medium py-2.5 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
