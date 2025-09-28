
import React, { useState, useEffect } from "react";
import { Badge as BadgeEntity } from "@/api/entities";
import { UserBadge } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

import BadgeCard from "../components/gamification/BadgeCard";
import ProgressBar from "../components/gamification/ProgressBar";

export default function AchievementsPage() {
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserAndRedirect();
  }, []);

  // Refresh data when the page becomes visible (user returns from quiz)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        loadUserAndRedirect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]); // Depend on 'user' to ensure it's loaded before trying to refresh

  const loadUserAndRedirect = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Check premium access: Pro member OR active trial
      const isPro = userData.pro_member;
      let hasActiveTrial = false;
      
      if (!isPro && userData.trial_started_date && !userData.trial_used) {
        const trialEndDate = new Date(userData.trial_started_date);
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        if (new Date() < trialEndDate) {
          hasActiveTrial = true;
        }
      }

      // Only redirect if user has NO premium access
      if (!isPro && !hasActiveTrial) {
        window.location.href = createPageUrl("GoPro");
        return;
      }
      
      // Load achievement data only for premium-access users
      const [allBadges, userBadgeData, userStatsData] = await Promise.all([
        BadgeEntity.list(),
        UserBadge.filter({ created_by: userData.email }),
        UserStats.filter({ created_by: userData.email })
      ]);
      
      setBadges(allBadges);
      setUserBadges(userBadgeData);
      
      if (userStatsData.length > 0) {
        setUserStats(userStatsData[0]);
      } else {
        // Create initial stats if none exist
        const initialStats = {
          total_points: 0,
          countries_explored: [],
          phrases_bookmarked_count: 0,
          cultural_insights_viewed: 0,
          streak_days: 0,
          created_by: userData.email
        };
        const createdStats = await UserStats.create(initialStats);
        setUserStats(createdStats);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading user data or achievements:", error);
      // If user is not authenticated or there's an error, redirect to upgrade page
      window.location.href = createPageUrl("GoPro");
    }
  };

  const isBadgeEarned = (badgeId) => {
    return userBadges.some(ub => ub.badge_id === badgeId);
  };

  const getBadgeProgress = (badge) => {
    if (!userStats) return 0;
    
    switch (badge.requirement_type) {
      case 'countries_visited':
        return userStats.countries_explored?.length || 0;
      case 'phrases_bookmarked':
        return userStats.phrases_bookmarked_count || 0;
      case 'insights_viewed':
        return userStats.cultural_insights_viewed || 0;
      case 'streak_days':
        return userStats.streak_days || 0;
      case 'total_points':
        return userStats.total_points || 0;
      default:
        return 0;
    }
  };

  const earnedBadges = badges.filter(badge => isBadgeEarned(badge.id));
  const availableBadges = badges.filter(badge => !isBadgeEarned(badge.id));

  const groupedBadges = {
    explorer: badges.filter(b => b.category === 'explorer'),
    linguist: badges.filter(b => b.category === 'linguist'),
    cultural_master: badges.filter(b => b.category === 'cultural_master'),
    social: badges.filter(b => b.category === 'social'),
    achievement: badges.filter(b => b.category === 'achievement')
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Please Log In
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">You need to be logged in to view your achievements.</p>
            <Button onClick={() => User.login()}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-slate-900">Achievements</h1>
          </div>
          <p className="text-lg text-slate-600">
            Earn badges and track your cultural learning journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar userStats={userStats} />
        </div>

        {/* Achievement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{earnedBadges.length}</div>
                <div className="text-slate-600">Badges Earned</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{availableBadges.length}</div>
                <div className="text-slate-600">Available Badges</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0}%</div>
                <div className="text-slate-600">Complete</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Badges Tabs */}
        <Tabs defaultValue="earned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="earned" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Earned ({earnedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Available ({availableBadges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="space-y-6">
            {earnedBadges.length === 0 ? (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">No badges earned yet</h2>
                <p className="text-slate-600">Start exploring countries to earn your first badge!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {earnedBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    isEarned={true}
                    progress={getBadgeProgress(badge)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={false}
                  progress={getBadgeProgress(badge)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
