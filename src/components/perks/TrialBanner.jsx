
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Clock, Gift, Timer } from 'lucide-react';
import { User } from '@/api/entities';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TrialBanner({ user, onTrialStart }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const handleTrialExpired = useCallback(async () => {
    try {
      await User.updateMyUserData({ trial_used: true });
      setTimeout(() => {
        setShowBanner(false);
      }, 5000); // Show expired message for 5 seconds
    } catch (error) {
      console.error('Error marking trial as expired:', error);
    }
  }, []); // No dependencies as it only uses state setters and a fixed setTimeout

  const startCountdown = useCallback((trialStartDate) => {
    // Clear any existing interval
    if (window.trialCountdownInterval) {
      clearInterval(window.trialCountdownInterval);
    }

    const updateCountdown = () => {
      const trialStart = new Date(trialStartDate);
      const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const now = new Date();
      const timeDiff = trialEnd - now;

      if (timeDiff <= 0) {
        // Trial has expired
        setIsExpired(true);
        setTimeLeft(null);
        handleTrialExpired(); // This is a dependency
        if (window.trialCountdownInterval) {
          clearInterval(window.trialCountdownInterval);
        }
        return;
      }

      // Calculate time components
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsExpired(false);
    };

    // Update immediately, then every second
    updateCountdown();
    window.trialCountdownInterval = setInterval(updateCountdown, 1000);
  }, [handleTrialExpired]); // handleTrialExpired is used inside updateCountdown

  useEffect(() => {
    // Show banner for non-logged-in users and logged-in users who aren't Pro
    if (!user) {
      // Show trial offer for visitors who haven't signed up
      setShowBanner(true);
      setTimeLeft(null);
      setIsExpired(false);
      return;
    }

    // Check if user is eligible for trial or currently on trial
    if (!user.pro_member) {
      if (!user.trial_used && !user.trial_started_date) {
        // User is eligible for trial
        setShowBanner(true);
        setTimeLeft(null);
      } else if (user.trial_started_date && !user.trial_used) {
        // User is on trial, start countdown
        setShowBanner(true);
        startCountdown(user.trial_started_date);
      }
    }

    // Cleanup interval on unmount
    return () => {
      if (window.trialCountdownInterval) {
        clearInterval(window.trialCountdownInterval);
      }
    };
  }, [user, startCountdown]);

  const handleStartTrial = async () => {
    if (!user) {
      // For non-logged-in users, redirect to GoPro page which will handle login + trial
      window.location.href = createPageUrl("GoPro");
      return;
    }
    
    // For logged-in users, redirect to GoPro page where they can select a plan
    window.location.href = createPageUrl("GoPro");
  };

  const formatTimeComponent = (value, unit) => {
    return (
      <div className="flex flex-col items-center bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
        <div className="text-2xl font-bold text-white">{value.toString().padStart(2, '0')}</div>
        <div className="text-xs text-purple-100 uppercase tracking-wide">{unit}</div>
      </div>
    );
  };

  if (!showBanner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4"
    >
      <Card className={`border-0 shadow-lg ${
        isExpired 
          ? 'bg-gradient-to-r from-red-500 to-pink-500' 
          : timeLeft 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
      } text-white`}>
        <CardContent className="p-4">
          {isExpired ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-6 h-6 text-red-200" />
                <h3 className="text-2xl font-bold">Trial Expired</h3>
              </div>
              <p className="text-red-100 mb-4">
                Your 7-day free trial has ended. Upgrade to continue enjoying all Premium features!
              </p>
              <Link to={createPageUrl("GoPro")}>
                <Button variant="secondary" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          ) : timeLeft ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Premium Trial Active!</h3>
                  <p className="text-purple-100">Time remaining in your free trial:</p>
                </div>
              </div>
              <div className="flex gap-2">
                {timeLeft.days > 0 && formatTimeComponent(timeLeft.days, timeLeft.days === 1 ? 'DAY' : 'DAYS')}
                {formatTimeComponent(timeLeft.hours, 'HRS')}
                {formatTimeComponent(timeLeft.minutes, 'MIN')}
                {formatTimeComponent(timeLeft.seconds, 'SEC')}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {user ? "🎉 Welcome to CultureCompass!" : "🌍 Start Your Cultural Journey Today!"}
                  </h3>
                  <p className="text-purple-100">
                    {user 
                      ? "Start your 7-day free trial to unlock all premium features." 
                      : "Sign up now and get 7 days free access to all 80+ countries and premium features."
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleStartTrial}
                >
                  {user ? "Start Free Trial" : "Sign Up & Try Free"}
                </Button>
                <p className="text-xs mt-1 text-purple-100/80">
                  {user ? "Card required. No charge for 7 days." : ""}
                </p>
              </div>
            </div>
          )}

          {timeLeft && !isExpired && (
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <p className="text-sm text-purple-100">
                Enjoying your trial? Upgrade now to keep all features!
              </p>
              <Link to={createPageUrl("GoPro")}>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
