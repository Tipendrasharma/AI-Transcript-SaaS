import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Generate', path: '/dashboard', icon: Plus },
    { label: 'History', path: '/dashboard/history', icon: History },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#0c0c0e] text-zinc-100 font-sans selection:bg-white selection:text-zinc-950">
      
      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between z-40">
        <span className="font-semibold text-[15px] tracking-tight">Audio Intelligence</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-zinc-400 hover:text-white p-1"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-[#0e0e11] border-r border-zinc-800/60 p-4 flex flex-col justify-between z-50 transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo / Brand */}
          <div className="px-2 pt-2">
            <h2 className="text-[16px] font-bold tracking-tight text-white flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Studio Engine</span>
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#18181b] text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141416]'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="border-t border-zinc-800/80 pt-4 px-2 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[12px] font-bold text-white uppercase">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[13px] font-medium text-white truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-9 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400 hover:text-white text-[13px] font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen pt-14 lg:pt-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
}