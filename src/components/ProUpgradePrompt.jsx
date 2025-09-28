
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function ProUpgradePrompt({ 
  title = "Unlock Pro Features", 
  description = "Get access to all countries, audio pronunciations, AI Travel Planner, and more!",
  features = [],
  className = ""
}) {
  const defaultFeatures = [
    "Access to all 80+ countries worldwide",
    "Personalized AI Travel Planner",
    "Audio pronunciations for authentic communication", 
    "Unlimited bookmarks with personal notes",
    "Offline access to all your saved content"
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Crown className="w-5 h-5 text-yellow-600" />
            {title}
          </CardTitle>
          <p className="text-slate-600 text-sm">{description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 mb-4">
            {displayFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
          <Link to={createPageUrl("GoPro")}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
