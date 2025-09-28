import React, { useState, useEffect, useCallback } from 'react';
import { CulturalIcebreaker } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  Utensils, 
  ShoppingBag, 
  Car,
  Home,
  Coffee,
  Handshake,
  Lightbulb,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const situationIcons = {
  business_meeting: Briefcase,
  social_gathering: Users,
  restaurant: Utensils,
  networking: Handshake,
  casual_encounter: Coffee,
  shopping: ShoppingBag,
  transportation: Car,
  family_dinner: Home
};

const situationLabels = {
  business_meeting: "Business Meeting",
  social_gathering: "Social Gathering", 
  restaurant: "Restaurant",
  networking: "Networking",
  casual_encounter: "Casual Encounter",
  shopping: "Shopping",
  transportation: "Transportation",
  family_dinner: "Family Dinner"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800", 
  advanced: "bg-red-100 text-red-800"
};

export default function CulturalIcebreakers({ countryName, compact = false }) {
  const [icebreakers, setIcebreakers] = useState([]);
  const [currentIcebreaker, setCurrentIcebreaker] = useState(null);
  const [selectedSituation, setSelectedSituation] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadIcebreakers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await CulturalIcebreaker.filter({ country_name: countryName });
      setIcebreakers(data);
      if (data.length > 0) {
        setCurrentIcebreaker(data[0]);
      }
    } catch (error) {
      console.error('Error loading icebreakers:', error);
    }
    setIsLoading(false);
  }, [countryName]);

  useEffect(() => {
    loadIcebreakers();
  }, [loadIcebreakers]);

  const getRandomIcebreaker = () => {
    const filtered = selectedSituation === 'all' 
      ? icebreakers 
      : icebreakers.filter(ib => ib.situation === selectedSituation);
    
    if (filtered.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setCurrentIcebreaker(filtered[randomIndex]);
  };

  const situations = [...new Set(icebreakers.map(ib => ib.situation))];

  if (compact && currentIcebreaker) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 w-full overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            <span className="truncate">Cultural Icebreaker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {situationIcons[currentIcebreaker.situation] && 
                React.createElement(situationIcons[currentIcebreaker.situation], { 
                  className: "w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" 
                })
              }
              <span className="text-xs sm:text-sm font-medium text-purple-800 truncate flex-1 min-w-0">
                {situationLabels[currentIcebreaker.situation]}
              </span>
              <Badge className={`${difficultyColors[currentIcebreaker.difficulty_level]} text-xs flex-shrink-0`}>
                {currentIcebreaker.difficulty_level}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 leading-tight break-words">
                {currentIcebreaker.icebreaker_text}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed break-words">
                {currentIcebreaker.cultural_context}
              </p>
            </div>
            
            <Button 
              onClick={getRandomIcebreaker} 
              variant="outline" 
              size="sm" 
              className="w-full text-xs sm:text-sm"
            >
              <RefreshCw className="w-3 h-3 mr-2 flex-shrink-0" />
              Get Another Tip
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg w-full">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="animate-pulse">
            <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">Loading cultural icebreakers...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (icebreakers.length === 0) {
    return (
      <Card className="bg-white shadow-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
            <span className="truncate">Cultural Icebreakers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 sm:py-8">
          <p className="text-gray-500 text-sm sm:text-base">No icebreakers available for {countryName} yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg w-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
          <span className="truncate">Cultural Icebreakers</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          AI-powered conversation starters and social tips
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Situation Filter - Mobile Optimized */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSituation === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSituation('all')}
              className="text-xs sm:text-sm flex-shrink-0"
            >
              All Situations
            </Button>
          </div>
          
          {situations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {situations.map(situation => (
                <Button
                  key={situation}
                  variant={selectedSituation === situation ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSituation(situation)}
                  className="flex items-center gap-1 text-xs sm:text-sm flex-shrink-0"
                >
                  {situationIcons[situation] && 
                    React.createElement(situationIcons[situation], { 
                      className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
                    })
                  }
                  <span className="hidden sm:inline">{situationLabels[situation]}</span>
                  <span className="sm:hidden">{situationLabels[situation].split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Current Icebreaker Display - Mobile Optimized */}
        <AnimatePresence mode="wait">
          {currentIcebreaker && (
            <motion.div
              key={currentIcebreaker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {situationIcons[currentIcebreaker.situation] && 
                        React.createElement(situationIcons[currentIcebreaker.situation], { 
                          className: "w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" 
                        })
                      }
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                          {currentIcebreaker.icebreaker_title}
                        </h3>
                        <p className="text-xs sm:text-sm text-purple-700 break-words">
                          {situationLabels[currentIcebreaker.situation]}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${difficultyColors[currentIcebreaker.difficulty_level]} text-xs flex-shrink-0 self-start sm:self-center`}>
                      {currentIcebreaker.difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-900 font-medium text-sm sm:text-base lg:text-lg leading-relaxed break-words">
                      {currentIcebreaker.icebreaker_text}
                    </p>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                      <strong>Why this works:</strong> {currentIcebreaker.cultural_context}
                    </p>
                  </div>

                  {currentIcebreaker.example_phrase && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs sm:text-sm text-blue-900 leading-relaxed break-words">
                        <strong>Try saying:</strong> "{currentIcebreaker.example_phrase}"
                      </p>
                    </div>
                  )}

                  {(currentIcebreaker.do_this || currentIcebreaker.avoid_this) && (
                    <div className="grid grid-cols-1 gap-3">
                      {currentIcebreaker.do_this && (
                        <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-green-900 text-xs sm:text-sm">Do This:</p>
                            <p className="text-xs sm:text-sm text-green-800 break-words leading-relaxed">
                              {currentIcebreaker.do_this}
                            </p>
                          </div>
                        </div>
                      )}
                      {currentIcebreaker.avoid_this && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-red-900 text-xs sm:text-sm">Avoid This:</p>
                            <p className="text-xs sm:text-sm text-red-800 break-words leading-relaxed">
                              {currentIcebreaker.avoid_this}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button - Mobile Optimized */}
        <div className="flex justify-center pt-2">
          <Button 
            onClick={getRandomIcebreaker} 
            className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base px-4 sm:px-6"
          >
            <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
            Get Another Icebreaker
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}