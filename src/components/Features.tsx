import React from 'react';
import { MousePointer, Building, FileCheck, Brain } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: MousePointer,
      title: "Drag & Drop Question Selection",
      description: "Choose and arrange questions effortlessly with our intuitive interface. Simply drag questions from your library and drop them into your paper layout.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Building,
      title: "Multi-School Support",
      description: "Manage question papers across multiple schools or institutes from one central dashboard. Perfect for educational groups and coaching centers.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FileCheck,
      title: "Smart PDF Generation",
      description: "Perfect alignment, automatic page breaks, and professional formatting. Generate beautiful question papers with answer keys in seconds.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Brain,
      title: "AI Assistance",
      description: "Our AI suggests relevant questions, improves efficiency, and saves time. Get intelligent recommendations based on curriculum and difficulty levels.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Tool?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make question paper creation faster, smarter, and more efficient than ever before.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Line */}
              <div className={`w-0 h-1 bg-gradient-to-r ${feature.color} mt-6 group-hover:w-full transition-all duration-500 rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
            <div className="text-gray-600">Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">150+</div>
            <div className="text-gray-600">Question Banks</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">5★</div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;