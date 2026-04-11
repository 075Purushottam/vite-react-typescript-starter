// import React, { useState, useEffect } from 'react';
// import { FileText, Menu, X, User } from 'lucide-react';

// interface NavbarProps {
//   onNavigate: (page: 'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile') => void;
// }

// const Navbar = ({ onNavigate }: NavbarProps) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest('.navbar-container')) {
//         setIsMenuOpen(false);
//       }
//     };

//     if (isMenuOpen) {
//       document.addEventListener('click', handleClickOutside);
//     }

//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMenuOpen]);

//   const menuItems = [
//     { name: 'Home', href: '#home' },
//     { name: 'Features', href: '#features' },
//     { name: 'How It Works', href: '#how-it-works' },
//     { name: 'Pricing', href: '#pricing' },
//     { name: 'Contact', href: '#contact' },
//   ];

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-container ${
//       isScrolled 
//         ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
//         : 'bg-transparent'
//     }`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Logo/Brand */}
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//               <span className={`text-xl font-bold transition-colors duration-300 ${
//                 isScrolled ? 'text-gray-900' : 'text-white'
//               }`}>
//                 Question Paper Tool
//               </span>
//             </div>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-8">
//               {menuItems.map((item) => (
//                 <a
//                   key={item.name}
//                   href={item.href}
//                   className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
//                     isScrolled 
//                       ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg' 
//                       : 'text-white/90 hover:text-white hover:bg-white/10 rounded-lg'
//                   }`}
//                 >
//                   {item.name}
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             <button 
//               onClick={() => onNavigate('profile')}
//               className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
//                 isScrolled 
//                   ? 'border-gray-300 hover:border-blue-500' 
//                   : 'border-white/30 hover:border-white'
//               }`}
//             >
//               <img
//                 src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </button>
//             <button className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
//               isScrolled 
//                 ? 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600' 
//                 : 'border-white/30 text-white hover:border-white hover:bg-white hover:text-gray-900'
//             }`}
//             onClick={() => onNavigate('login')}>
//               Login
//             </button>
//             <button 
//               className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
//               onClick={() => onNavigate('signup')}>
//               Sign Up
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className={`p-2 rounded-lg transition-all duration-300 ${
//                 isScrolled 
//                   ? 'text-gray-700 hover:bg-gray-100' 
//                   : 'text-white hover:bg-white/10'
//               }`}
//             >
//               {isMenuOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
//           isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//         }`}>
//           <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg border-t border-gray-100 mt-2">
//             {menuItems.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.name}
//               </a>
//             ))}
            
//             {/* Mobile Auth Buttons */}
//             <div className="pt-4 pb-2 space-y-3">
//               <button 
//                 className="w-full px-4 py-3 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
//                 onClick={() => {
//                   onNavigate('profile');
//                   setIsMenuOpen(false);
//                 }}>
//                 <User className="w-4 h-4 mr-2" />
//                 Profile
//               </button>
//               <button 
//                 className="w-full px-4 py-3 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
//                 onClick={() => {
//                   onNavigate('login');
//                   setIsMenuOpen(false);
//                 }}>
//                 Login
//               </button>
//               <button 
//                 className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//                 onClick={() => {
//                   onNavigate('signup');
//                   setIsMenuOpen(false);
//                 }}>
//                 Sign Up
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from 'react';
import { FileText, Menu, X, User, LogOut } from 'lucide-react';
import { getCurrentUser, isLoggedIn, logoutUser } from '../lib/auth';

interface NavbarProps {
  onNavigate: (page: 'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile', state?: any) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn());

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      setUser(getCurrentUser());
      setUserLoggedIn(isLoggedIn());
    };

    checkAuthStatus();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar-container')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setUserLoggedIn(false);
    setIsMenuOpen(false);
    onNavigate('home');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-container ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Question Paper Tool
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 rounded-lg'
                  }`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userLoggedIn && user ? (
              <>
                <button 
                  onClick={() => onNavigate('profile', {from: 'home'})}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
                    isScrolled ? 'border-gray-300' : 'border-white/30'
                  }`}>
                    <img
                      src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600' 
                      : 'border-white/30 text-white hover:border-white hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600' 
                    : 'border-white/30 text-white hover:border-white hover:bg-white hover:text-gray-900'
                }`}
                onClick={() => onNavigate('login')}>
                  Login
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => onNavigate('signup')}>
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg border-t border-gray-100 mt-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-2 space-y-3">
              {userLoggedIn && user ? (
                <>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 mr-3">
                      <img
                        src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
                    onClick={() => {
                      onNavigate('profile');
                      setIsMenuOpen(false);
                    }}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button 
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    onClick={() => {
                      handleLogout();
                    }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                    onClick={() => {
                      onNavigate('login');
                      setIsMenuOpen(false);
                    }}>
                    Login
                  </button>
                  <button 
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      onNavigate('signup');
                      setIsMenuOpen(false);
                    }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;