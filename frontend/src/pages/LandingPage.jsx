import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillfinityLogo from '../components/Logo';
import {
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineCloudArrowUp,
  HiOutlineDevicePhoneMobile,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineGlobeAlt
} from 'react-icons/hi2';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: HiOutlineChartBarSquare,
      title: "Smart Analytics",
      description: "Real-time insights and comprehensive reporting to track your business performance and make data-driven decisions."
    },
    {
      icon: HiOutlineClipboardDocumentList,
      title: "Inventory Management",
      description: "Effortlessly manage your stock levels, track products, and get automated alerts for low inventory."
    },
    {
      icon: HiOutlineCurrencyDollar,
      title: "Automated Billing",
      description: "Generate professional invoices instantly with automated tax calculations and payment tracking."
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data encryption and regular backups to keep your business safe."
    },
    {
      icon: HiOutlineCloudArrowUp,
      title: "Cloud-Based",
      description: "Access your business data anywhere, anytime with our secure cloud infrastructure."
    },
    {
      icon: HiOutlineDevicePhoneMobile,
      title: "Mobile Friendly",
      description: "Fully responsive design that works perfectly on all devices - desktop, tablet, and mobile."
    }
  ];

  const benefits = [
    "Reduce manual errors and save time",
    "Track inventory in real-time",
    "Generate professional invoices instantly",
    "Access your data from anywhere",
    "Automated low-stock alerts",
    "Comprehensive business reports"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <BillfinityLogo size="md" showText={true} />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Benefits</a>
              <a href="#about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Contact</a>
              <button 
                onClick={() => navigate('/login', { state: { fromLanding: true } })}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-purple-200"
              >
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-purple-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-purple-100">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium">Features</a>
                <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium">Benefits</a>
                <a href="#about" className="text-gray-700 hover:text-purple-600 font-medium">About</a>
                <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium">Contact</a>
                <button 
                  onClick={() => navigate('/login', { state: { fromLanding: true } })}
                  className="w-full px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Inventory Control &{' '}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Billing Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your business operations with Billfinity's comprehensive inventory management 
              and automated billing system. Boost efficiency, reduce errors, and grow your business.
            </p>

            <div className="flex justify-center items-center mb-16">
              <button 
                onClick={() => navigate('/login', { state: { fromLanding: true } })}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-purple-200 flex items-center gap-2"
              >
                Get Started Free
                <HiOutlineArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Manage Your Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your operations and boost productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Billfinity?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Transform your business operations with our comprehensive solution designed for modern businesses.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <HiOutlineCheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-100">
                <div className="text-center">
                  <BillfinityLogo size="xl" showText={false} className="justify-center mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-600 mb-6">
                    Join the digital transformation and take your business to the next level with Billfinity.
                  </p>
                  <button 
                    onClick={() => navigate('/login', { state: { fromLanding: true } })}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-purple-200"
                  >
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Billfinity
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Billfinity is designed to simplify business operations for small to medium enterprises. 
            Our comprehensive platform combines inventory management with automated billing to help 
            businesses operate more efficiently and focus on growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                <HiOutlineChartBarSquare className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Data-Driven</h3>
              <p className="text-gray-600">Make informed decisions with comprehensive analytics and reporting</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                <HiOutlineShieldCheck className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">Your business data is protected with enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                <HiOutlineDevicePhoneMobile className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Accessible</h3>
              <p className="text-gray-600">Access your business from anywhere with our mobile-friendly design</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Experience the power of smart inventory management and automated billing
          </p>
          <button 
            onClick={() => navigate('/login', { state: { fromLanding: true } })}
            className="px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg flex items-center gap-2 mx-auto"
          >
            Get Started Today
            <HiOutlineArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <BillfinityLogo size="md" showText={true} className="mb-6" />
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering businesses with smart inventory control and automated billing solutions. 
                Streamline your operations and focus on what matters most - growing your business.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
                  <HiOutlineGlobeAlt size={20} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Billfinity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}