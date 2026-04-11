import React from 'react';
import { FileText, Play, BookOpen } from 'lucide-react';
import { isLoggedIn } from '@/lib/auth';

interface HeroProps {
  onNavigate: (page: 'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile') => void;
}

const Hero = ({onNavigate} : HeroProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 opacity-90"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Create Question Papers in Minutes –{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Smart, Simple, Seamless
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Save time and effort with our AI-powered question paper creation tool. 
                Perfect for schools, colleges, and coaching centers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                // onClick={() => onNavigate('exam-form')}
                onClick={() =>{
                  if (isLoggedIn()){
                    onNavigate('exam-form')
                  } else {
                    onNavigate('login')
                  }
                } }
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Create Paper
              </button>
              
              <button className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Try Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-blue-200 text-sm">Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-200 text-sm">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-blue-200 text-sm">Papers Created</div>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative">
            <div className="relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Laptop Mockup */}
              <div className="bg-gray-800 rounded-t-3xl p-4">
                <div className="bg-white rounded-t-2xl overflow-hidden shadow-2xl">
                  {/* Browser Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white rounded mx-4 px-3 py-1 text-xs text-gray-500">
                      questionpapertool.com
                    </div>
                  </div>
                  
                  {/* App Interface */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Question Paper Builder</h3>
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      {/* Sample Questions */}
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                          <div className="text-sm text-gray-700">Q1. What is photosynthesis?</div>
                          <div className="text-xs text-gray-500 mt-1">Biology • Chapter 2 • 2 marks</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                          <div className="text-sm text-gray-700">Q2. Solve: 2x + 5 = 15</div>
                          <div className="text-xs text-gray-500 mt-1">Mathematics • Chapter 4 • 3 marks</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-500">
                          <div className="text-sm text-gray-700">Q3. Explain the water cycle</div>
                          <div className="text-xs text-gray-500 mt-1">Geography • Chapter 1 • 5 marks</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Generate PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop Base */}
              <div className="bg-gray-800 h-4 rounded-b-3xl"></div>
              <div className="bg-gray-700 h-1 rounded-full mx-8"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce delay-300">
              <FileText className="w-8 h-8 text-yellow-800" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
              <BookOpen className="w-6 h-6 text-green-800" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;