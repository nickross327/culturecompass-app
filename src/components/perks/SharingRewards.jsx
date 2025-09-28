
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Star, Crown, Check } from 'lucide-react';
import { User } from '@/api/entities';
import { motion } from 'framer-motion';

const SHARING_REWARDS = [
  {
    shares: 10,
    reward: "1 month of Premium for free",
    icon: "👑",
    unlocked: false
  }
];

export default function SharingRewards({ user, onRewardUnlocked }) {
  const [copySuccess, setCopySuccess] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const userShares = user?.shares_completed || 0;
  const userReferralCode = user?.referral_code || generateReferralCode(user?.email);

  function generateReferralCode(email) {
    if (!email) return 'CULTURE2024';
    return 'CULTURE' + email.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);
  }

  const shareMessage = `🌍 Discover CultureCompass - the app that helps you travel with cultural confidence!

Master essential phrases, understand local customs, and connect with fellow travelers worldwide.

Join me and get 7 days of Premium features FREE: https://culturecompass.app?ref=${userReferralCode}

#CultureCompass #TravelSmart #CulturalAwareness`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
      
      // Track the share
      await handleShare('copy');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async (method) => {
    try {
      setIsSharing(true);
      
      if (method === 'native' && navigator.share) {
        await navigator.share({
          title: 'CultureCompass - Travel with Cultural Confidence',
          text: shareMessage,
          url: `https://culturecompass.app?ref=${userReferralCode}`
        });
      }

      // Update share count
      const newShareCount = userShares + 1;
      await User.updateMyUserData({ 
        shares_completed: newShareCount,
        referral_code: userReferralCode
      });

      // Check for rewards
      checkForNewRewards(newShareCount);
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const checkForNewRewards = (shareCount) => {
    SHARING_REWARDS.forEach((reward, index) => {
      if (shareCount >= reward.shares && userShares < reward.shares) {
        // New reward unlocked!
        onRewardUnlocked && onRewardUnlocked(reward);
      }
    });
  };

  const getRewardStatus = (requiredShares) => {
    if (userShares >= requiredShares) return 'unlocked';
    if (userShares >= requiredShares - 1) return 'almost';
    return 'locked';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          Share & Unlock Rewards
        </CardTitle>
        <p className="text-sm text-slate-600">
          Help friends discover CultureCompass and unlock premium features for yourself!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Progress */}
        <div className="text-center p-4 bg-white rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-1">{userShares}</div>
          <div className="text-sm text-slate-600">Successful Shares</div>
          <Badge variant="outline" className="mt-2">
            Referral Code: {userReferralCode}
          </Badge>
        </div>

        {/* Sharing Options */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Share CultureCompass:</h4>
          <div className="flex gap-2">
            {navigator.share && (
              <Button 
                onClick={() => handleShare('native')}
                disabled={isSharing}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share App
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copySuccess || 'Copy Link'}
            </Button>
          </div>
        </div>

        {/* Rewards Progress */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Unlock Rewards:</h4>
          {SHARING_REWARDS.map((reward, index) => {
            const status = getRewardStatus(reward.shares);
            return (
              <motion.div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  status === 'unlocked' 
                    ? 'bg-green-50 border-green-200' 
                    : status === 'almost'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <p className="font-medium text-slate-900">{reward.reward}</p>
                      <p className="text-sm text-slate-600">
                        {reward.shares} share{reward.shares !== 1 ? 's' : ''} required
                      </p>
                    </div>
                  </div>
                  {status === 'unlocked' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {status === 'almost' && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {reward.shares - userShares} more!
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
