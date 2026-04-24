import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Store token and user info in localStorage
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(res.data));
      
      navigate('/admin'); // Redirect to dashboard
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-red-600/10 rounded-2xl mb-4">
            <Lock className="text-red-600" size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter">ADMIN LOGIN</h2>
          <p className="text-zinc-500 text-sm mt-2">Enter credentials to access terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="email"
                required
                className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-white"
                placeholder="admin@swfittrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="password"
                required
                className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-red-600 transition-all text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl mt-4 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Access Terminal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;