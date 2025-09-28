import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap } from "lucide-react";

export default function ProgressBar({ userStats }) {
  const getCurrentLevel = (points) => Math.floor(points / 100) + 1;
  const getPointsToNextLevel = (points) => (getCurrentLevel(points) * 100) - points;
  const getLevelProgress = (points) => (points % 100) / 100 * 100;

  const level = getCurrentLevel(userStats?.total_points || 0);
  const progressPercent = getLevelProgress(userStats?.total_points || 0);
  const pointsToNext = getPointsToNextLevel(userStats?.total_points || 0);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-900">Level {level}</span>
            <span className="text-sm text-slate-600">{pointsToNext} pts to next level</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-slate-900">{userStats?.total_points || 0}</div>
            <div className="text-xs text-slate-600">Points</div>
          </div>
          
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <Star className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-slate-900">{userStats?.countries_explored?.length || 0}</div>
            <div className="text-xs text-slate-600">Countries</div>
          </div>
          
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-slate-900">{userStats?.streak_days || 0}</div>
            <div className="text-xs text-slate-600">Day Streak</div>
          </div>
          
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="font-bold text-lg text-slate-900">{userStats?.phrases_bookmarked_count || 0}</div>
            <div className="text-xs text-slate-600">Bookmarks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}