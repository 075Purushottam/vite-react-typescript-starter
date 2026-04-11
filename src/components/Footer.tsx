import React from 'react';
import { FileText, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Demo', href: '#demo' },
    { name: 'Contact', href: '#contact' },
  ];

  const resources = [
    { name: 'Help Center', href: '#' },
    { name: 'Tutorials', href: '#' },
    { name: 'API Docs', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Templates', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-12 py-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Question Paper Tool</span>
            </div>
            
            <p className="text-gray-400 leading-relaxed mb-6">
              Revolutionizing education with smart question paper creation tools. 
              Trusted by thousands of educators worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-gray-400">support@questionpapertool.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-400">+91 9876543210</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-gray-400">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-blue-500 group-hover:w-4 transition-all duration-300 mr-2"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all duration-300 mr-2"></span>
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest updates and educational resources.
            </p>
            
            <div className="space-y-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4 pt-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Question Paper Tool. All Rights Reserved.
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;