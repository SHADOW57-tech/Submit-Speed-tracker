import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ship, LayoutDashboard, Search, UserCircle, LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const token = localStorage.getItem('token');
  const stored = localStorage.getItem('userInfo') || localStorage.getItem('adminInfo');
  const userInfo = token && stored ? JSON.parse(stored) : null;
  const role = userInfo?.role?.toString().toLowerCase();
  const isAdmin = role === 'admin' || role === 'owner';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminInfo');
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* FIX: Increased Z-Index to 999 
         FIX: Background is now solid white/zinc to prevent ghosting
      */}
      <nav className="fixed top-0 left-0 w-full z-[999] border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 flex-shrink-0 relative z-[1000]">
            <div className="bg-red-600 p-1.5 rounded-lg flex-shrink-0">
              <Ship className="text-white" size={20} />
            </div>
            <span className="text-lg font-black tracking-tighter dark:text-white text-black whitespace-nowrap">
              SUBMIT <span className="text-red-600">SPEED</span>
            </span>
          </Link>

          {/* Desktop Links */}
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

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {!token ? (
              <Link to="/user-login" className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white dark:text-black text-white text-xs font-bold">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3 md:pl-4 md:border-l border-zinc-200 dark:border-zinc-800">
                <UserCircle className="text-red-600" size={24} />
                <button onClick={handleLogout} className="hidden md:block text-zinc-500 hover:text-red-600">
                  <LogOut size={20} />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-900 dark:text-white relative z-[1000]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer - FIX: Added Top Padding for the Notch */}
        <div className={`md:hidden fixed inset-0 z-[998] bg-white dark:bg-zinc-950 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-10 px-8 pt-20">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black flex items-center gap-4">
              <Search size={28} /> TRACK
            </Link>
            
            {token && isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black flex items-center gap-4">
                <LayoutDashboard size={28} /> TERMINAL
              </Link>
            )}

            {token && (
              <button 
                onClick={handleLogout}
                className="mt-8 flex items-center gap-3 text-red-600 font-black text-2xl"
              >
                <LogOut size={28} /> LOGOUT
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* CRITICAL FIX: This empty div pushes your page content down 
          so the "TERMINAL" title doesn't hide behind the header.
      */}
      <div className="h-20 w-full"></div>
    </>
  );
};

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${
      active ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
    }`}
  >
    {children}
  </Link>
);

export default Header;