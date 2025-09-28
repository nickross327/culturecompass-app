import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const rarityColors = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300", 
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-300"
};

const rarityGlow = {
  common: "",
  rare: "shadow-blue-200",
  epic: "shadow-purple-200", 
  legendary: "shadow-yellow-200"
};

export default function BadgeCard({ badge, isEarned, progress, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`${isEarned ? 'bg-white' : 'bg-gray-50 opacity-60'} border-2 ${
        isEarned ? rarityGlow[badge.rarity] : ''
      } hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-4 text-center">
          <div className="text-4xl mb-2">{badge.icon}</div>
          <h3 className={`font-bold text-sm mb-1 ${isEarned ? 'text-slate-900' : 'text-slate-500'}`}>
            {badge.name}
          </h3>
          <p className={`text-xs mb-2 ${isEarned ? 'text-slate-600' : 'text-slate-400'}`}>
            {badge.description}
          </p>
          <div className="flex justify-center gap-1 mb-2">
            <Badge className={rarityColors[badge.rarity]} variant="outline">
              {badge.rarity}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {badge.points} pts
            </Badge>
          </div>
          {!isEarned && progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((progress / badge.requirement_count) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}