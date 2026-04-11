
import React, { useState } from 'react';
import { FileText, Mail, Lock, User, Eye, EyeOff, BookOpen, PenTool, FileCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { signupUser, validateEmail, validatePassword } from '../lib/auth';

interface SignUpProps {
  onNavigate: (page: 'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile') => void;
}

const SignUp = ({ onNavigate }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Full name is required.' });
      return false;
    }
    
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required.' });
      return false;
    }
    
    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return false;
    }
    
    if (!formData.password) {
      setMessage({ type: 'error', text: 'Password is required.' });
      return false;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setMessage({ type: 'error', text: passwordValidation.message });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: "Account created successfully! Please login." });
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onNavigate('login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'An unexpected Signup error occurred. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected Signup error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Education Icons */}
      <div className="absolute top-24 left-24 opacity-20">
        <PenTool className="w-14 h-14 text-teal-600 animate-bounce delay-500" />
      </div>
      <div className="absolute bottom-40 right-32 opacity-20">
        <FileCheck className="w-18 h-18 text-blue-600 animate-pulse delay-1500" />
      </div>
      <div className="absolute top-1/2 right-20 opacity-20">
        <BookOpen className="w-16 h-16 text-purple-600 animate-bounce delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors duration-300 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mr-2 group-hover:bg-teal-50 transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join thousands of educators using our tool</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Success/Error Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                  placeholder="Create a password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                  placeholder="Confirm your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                disabled={loading}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-teal-600 hover:text-teal-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal-600 hover:text-teal-700 underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={() => onNavigate('login')}
                  className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Benefits */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-4">Start creating professional question papers today</p>
          <div className="flex justify-center space-x-6 opacity-60">
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              Free 14-day trial
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              No credit card required
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;