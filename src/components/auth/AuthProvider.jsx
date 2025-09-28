import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { User } from '@/api/entities';
import { Notification } from '@/api/entities';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const loadUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // --- New User Onboarding Flow ---
      if (userData) {
        // 1. Create a notification for admins
        if (!userData.welcome_notification_sent) {
          try {
            await Notification.create({
              title: "New User Signed Up",
              message: `A new user, ${userData.full_name} (${userData.email}), has just joined.`,
              type: "new_user"
            });
            await User.updateMyUserData({ welcome_notification_sent: true });
          } catch (notificationError) {
            console.error("Failed to process new user notification flow:", notificationError);
          }
        }
      }

    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const reloadUser = useCallback(() => {
    return loadUser();
  }, [loadUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = { user, isLoadingUser, reloadUser };

  return (
    <AuthContext.Provider value={value}>
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