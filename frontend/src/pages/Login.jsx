import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BillfinityLogo from "../components/Logo";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle
} from "react-icons/hi2";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only redirect if user is authenticated AND not coming from landing page
  useEffect(() => {
    if (isAuthenticated && location.state?.fromLanding !== true) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        // Small delay to show success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="w-[420px] bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-[0_20px_50px_rgba(139,92,246,0.15)] border border-purple-100 fade-in relative z-10">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <BillfinityLogo size="xl" showText={false} className="mb-4" />
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            BILLFINITY
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Smart Inventory Control & Billing
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <HiOutlineExclamationTriangle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <HiOutlineCheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineEnvelope
                className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                         outline-none transition-all duration-200
                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                         hover:border-purple-200 bg-white/70
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 text-sm border-2 border-purple-100 rounded-xl
                         outline-none transition-all duration-200
                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                         hover:border-purple-200 bg-white/70
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white
                     bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600
                     hover:from-purple-600 hover:via-violet-600 hover:to-purple-700
                     active:scale-[0.98] transition-all duration-200
                     shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300
                     disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              "Sign In to Billfinity"
            )}
          </button>
        </form>

        {/* JWT Info */}
        <div className="mt-6 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
          <p className="text-xs text-purple-700 text-center">
            🔐 Secured with JWT Authentication
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Secure access for authorized personnel only
          </p>
          <p className="text-xs text-purple-600 mt-1 font-medium">
            © 2026 Billfinity. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}