import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { useAuth } from '@/components/auth/AuthProvider';
import SmartTranslator from '@/components/translator/SmartTranslator';
import { createPageUrl } from '@/utils';

export default function TranslatorPage() {
  const { user, isLoadingUser } = useAuth();

  useEffect(() => {
    if (isLoadingUser) return;
    
    if (!user) {
      User.login();
      return;
    }

    // Check if user has premium access
    const isPro = user.pro_member;
    let hasActiveTrial = false;
    
    if (!isPro && user.trial_started_date && !user.trial_used) {
      const trialEndDate = new Date(user.trial_started_date);
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      if (new Date() < trialEndDate) {
        hasActiveTrial = true;
      }
    }

    if (!isPro && !hasActiveTrial) {
      window.location.href = createPageUrl("GoPro");
      return;
    }
  }, [user, isLoadingUser]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading translator...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <SmartTranslator />
      </div>
    </div>
  );
}