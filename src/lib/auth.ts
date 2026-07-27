
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
export const signupUser = async (signupData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await fetch('https://questions-backend-production-d886.up.railway.app/api/v1/signup/', {
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


export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch('https://questions-backend-production-d886.up.railway.app/api/v1/login/', {
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
      // persist subscription object if backend returns it
      if (data.subscription) {
        localStorage.setItem('user_subscription', JSON.stringify(data.subscription));
      } else {
        localStorage.removeItem('user_subscription');
      }
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
  localStorage.removeItem('user_subscription');
  // keep clear commented out to avoid removing other app-wide keys unexpectedly
  // localStorage.clear();
};

// Get current user subscription (if any)
export const getCurrentUserSubscription = (): any | null => {
  try {
    const sub = localStorage.getItem('user_subscription');
    return sub ? JSON.parse(sub) : null;
  } catch (error) {
    console.error('Error getting current subscription:', error);
    return null;
  }
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