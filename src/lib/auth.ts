import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// Hash password
// const hashPassword = async (password: string): Promise<string> => {
//   const saltRounds = 12;
//   return await bcrypt.hash(password, saltRounds);
// };

// // Verify password
// const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
//   return await bcrypt.compare(password, hashedPassword);
// };

// Check if email exists
// const checkEmailExists = async (email: string): Promise<boolean> => {
//   const { data, error } = await supabase
//     .from('users')
//     .select('id')
//     .eq('email', email.toLowerCase())
//     .single();
  
//   return !error && data !== null;
// };

// Signup function
// export const signupUser = async (signupData: SignupData): Promise<AuthResponse> => {
//   try {
//     const { name, email, password } = signupData;
    
//     // Check if email already exists
//     const emailExists = await checkEmailExists(email);
//     if (emailExists) {
//       return {
//         success: false,
//         message: 'Email already registered, please login.'
//       };
//     }
    
//     // Hash password
//     const hashedPassword = await hashPassword(password);
    
//     // Insert user into database
//     const { data, error } = await supabase
//       .from('users')
//       .insert([
//         {
//           name: name.trim(),
//           email: email.toLowerCase().trim(),
//           password: hashedPassword
//         }
//       ])
//       .select('id, name, email, created_at, updated_at')
//       .single();
    
//     if (error) {
//       console.error('Signup error:', error);
//       return {
//         success: false,
//         message: 'Failed to create account. Please try again.'
//       };
//     }
    
//     return {
//       success: true,
//       message: 'Account created successfully! Please login.',
//       user: data
//     };
    
//   } catch (error) {
//     console.error('Signup error:', error);
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     };
//   }
// };
export const signupUser = async (signupData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    return data;

  } catch (error) {
    return {
      success: false,
      message: 'Server error. Please try again.'
    };
  }
};

// Login function
// export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
//   try {
//     const { email, password } = loginData;
    
//     // Get user from database
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, name, email, password, created_at, updated_at')
//       .eq('email', email.toLowerCase().trim())
//       .single();
    
//     if (error || !user) {
//       return {
//         success: false,
//         message: 'Invalid email or password.'
//       };
//     }
    
//     // Verify password
//     const isPasswordValid = await verifyPassword(password, user.password);
//     if (!isPasswordValid) {
//       return {
//         success: false,
//         message: 'Invalid email or password.'
//       };
//     }
    
//     // Create session
//     const sessionData = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       created_at: user.created_at,
//       updated_at: user.updated_at
//     };
    
//     // Store in localStorage
//     localStorage.setItem('user_session', JSON.stringify(sessionData));
//     localStorage.setItem('is_logged_in', 'true');
    
//     return {
//       success: true,
//       message: 'Login successful!',
//       user: sessionData
//     };
    
//   } catch (error) {
//     console.error('Login error:', error);
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     };
//   }
// };
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('user_session', JSON.stringify(data.user));
      localStorage.setItem('is_logged_in', 'true');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data;

  } catch (error) {
    return {
      success: false,
      message: 'Server error. Please try again.'
    };
  }
};


// Get current user session
export const getCurrentUser = (): User | null => {
  try {
    const isLoggedIn = localStorage.getItem('is_logged_in');
    const userSession = localStorage.getItem('user_session');
    
    if (isLoggedIn === 'true' && userSession) {
      return JSON.parse(userSession);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return localStorage.getItem('is_logged_in') === 'true';
};

// Logout function
export const logoutUser = (): void => {
  localStorage.removeItem('user_session');
  localStorage.removeItem('is_logged_in');
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("paperCreatorState");
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number.' };
  }
  
  return { isValid: true, message: 'Password is strong.' };
};