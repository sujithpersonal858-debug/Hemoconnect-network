
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hemoconnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [donorProfile, setDonorProfile] = useState(() => {
    const saved = localStorage.getItem('hemoconnect_donor_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('hemoconnect_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('hemoconnect_token');

        if (storedToken) {
          const res = await api.getMe();

          if (res && res.success && res.user) {
            setUser(res.user);
            setDonorProfile(res.donorProfile || null);

            localStorage.setItem('hemoconnect_user', JSON.stringify(res.user));

            if (res.donorProfile) {
              localStorage.setItem('hemoconnect_donor_profile', JSON.stringify(res.donorProfile));
            } else {
              localStorage.removeItem('hemoconnect_donor_profile');
            }
          } else {
            logout();
          }
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, selectedRole) => {
    const res = await api.login({ email, password });

    if (res && res.success && res.user && res.token) {
      if (selectedRole && res.user.role !== selectedRole) {
        return {
          success: false,
          message: `This account is registered as ${res.user.role}. Please select the correct login portal.`
        };
      }

      setUser(res.user);
      setDonorProfile(res.donorProfile || null);
      setToken(res.token);

      localStorage.setItem('hemoconnect_token', res.token);
      localStorage.setItem('hemoconnect_user', JSON.stringify(res.user));

      if (res.donorProfile) {
        localStorage.setItem('hemoconnect_donor_profile', JSON.stringify(res.donorProfile));
      } else {
        localStorage.removeItem('hemoconnect_donor_profile');
      }

      return { success: true, user: res.user };
    }

    return { success: false, message: res?.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.register(userData);

    if (res && res.success && res.user && res.token) {
      setUser(res.user);
      setDonorProfile(res.donorProfile || null);
      setToken(res.token);

      localStorage.setItem('hemoconnect_token', res.token);
      localStorage.setItem('hemoconnect_user', JSON.stringify(res.user));

      if (res.donorProfile) {
        localStorage.setItem('hemoconnect_donor_profile', JSON.stringify(res.donorProfile));
      } else {
        localStorage.removeItem('hemoconnect_donor_profile');
      }

      return { success: true, user: res.user };
    }

    return { success: false, message: res?.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setDonorProfile(null);
    setToken(null);

    localStorage.removeItem('hemoconnect_token');
    localStorage.removeItem('hemoconnect_user');
    localStorage.removeItem('hemoconnect_donor_profile');
  };

  const updateUserProfile = (updatedUser, updatedDonorProfile) => {
    if (updatedUser) {
      setUser(prev => {
        const mergedUser = { ...prev, ...updatedUser };
        localStorage.setItem('hemoconnect_user', JSON.stringify(mergedUser));
        return mergedUser;
      });
    }

    if (updatedDonorProfile !== undefined) {
      setDonorProfile(updatedDonorProfile);

      if (updatedDonorProfile) {
        localStorage.setItem('hemoconnect_donor_profile', JSON.stringify(updatedDonorProfile));
      } else {
        localStorage.removeItem('hemoconnect_donor_profile');
      }
    }
  };

  const isAdmin = user?.role === 'admin';
  const isDonor = user?.role === 'donor';
  const isSeeker = user?.role === 'seeker';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        donorProfile,
        setDonorProfile,
        updateUserProfile,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isDonor,
        isSeeker
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
