import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ship, LayoutDashboard, Search, UserCircle, LogOut } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');
  const token = localStorage.getItem('token');
  const userInfo = token ? JSON.parse(localStorage.getItem('userInfo') || '{}') : null;
  const isAdmin = userInfo?.role === 'Admin' || userInfo?.role === 'SuperAdmin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-100 border-b border-zinc-200/10 dark:border-zinc-800/50 bg-white/70 dark:bg-background backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-red-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Ship className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter dark:text-foreground text-black">
            SUBMIT <span className="text-red-600">SPEED</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" active={location.pathname === '/'}>
            <Search size={18} /> Track
          </NavLink>
          
          {token && isAdmin && (
            <NavLink to="/admin" active={isAdminPath}>
              <LayoutDashboard size={18} /> Terminal
            </NavLink>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link 
                to="/user-login" 
                className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white dark:text-black text-white text-sm font-bold hover:scale-105 transition-all"
              >
                Login
              </Link>
              <Link 
                to="/user-register" 
                className="px-5 py-2.5 rounded-xl border border-zinc-800 dark:border-zinc-200 text-zinc-900 dark:text-white text-sm font-bold hover:scale-105 transition-all"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <span className="text-xs font-bold text-zinc-500 hidden lg:block uppercase tracking-widest">
                {isAdmin ? 'Operator' : 'User'}
              </span>
              <UserCircle className="text-red-600" size={28} />
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 text-sm font-bold transition-colors ${
      active ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
    }`}
  >
    {children}
  </Link>
);

export default Header;