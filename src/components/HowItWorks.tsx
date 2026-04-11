import React from 'react';
import { LogIn, FileText, BookOpen, MousePointer, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: LogIn,
      title: "Login",
      description: "Sign in to your account to access all features and your question banks.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      title: "Fill Basic Details",
      description: "Enter school name, class, subjects, board, and other info to create a paper format.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "Select Books & Chapters",
      description: "Choose the books and chapters you want to include in your question paper.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: MousePointer,
      title: "Create Paper",
      description: "Select or drag & drop questions into the paper section to build your question paper.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Download,
      title: "Save & Download",
      description: "Instantly generate and download the paper with an answer sheet in PDF format.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow these simple steps to create professional question papers in minutes.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-teal-200 via-orange-200 to-green-200 transform -translate-y-1/2 z-0"></div>

          {/* Steps */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10">
                {/* Step Card */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 border border-gray-100">
                  
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className={`w-0 h-1 bg-gradient-to-r ${step.color} mt-6 mx-auto group-hover:w-full transition-all duration-500 rounded-full`}></div>
                </div>

                {/* Arrow for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Creating Now
            <MousePointer className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;