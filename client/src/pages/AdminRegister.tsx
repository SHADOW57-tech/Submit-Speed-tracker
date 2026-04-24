import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(res.data));
      alert("Admin Account Created Successfully!");
      navigate('/admin');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl mb-4">
            <UserPlus className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">SUBMIT SPEED</h2>
          <p className="text-zinc-500 text-sm mt-2">Create a new operator account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="email"
                required
                className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
                placeholder="name@submitspeed.com"
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
                className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Confirm Password</label>
            <div className="relative">
              <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="password"
                required
                className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl mt-4 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-sm">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;