import useAuth from '../hooks/useAuth';

export default function Topbar({ title }) {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-14 border-b border-[#e5e7eb] bg-white flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-[#1f2937]">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400">{today}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1f2937]">{user?.full_name}</span>
          <span className="text-xs bg-[#1e3a5f] text-white px-2 py-0.5 rounded">{user?.role}</span>
        </div>
      </div>
    </header>
  );
}
