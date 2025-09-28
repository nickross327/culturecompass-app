
import React, { useState, useEffect } from 'react';
import { Gesture } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hand, Globe, Check, X, ArrowLeft, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Link } from "react-router-dom";

export default function GestureGuidePage() {
  const [gestures, setGestures] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const gestureData = await Gesture.list();
        
        // Sort gestures alphabetically by country name, then by gesture name
        const sortedGestures = gestureData.sort((a, b) => {
          const countryCompare = a.country_name.localeCompare(b.country_name);
          if (countryCompare === 0) {
            return a.name.localeCompare(b.name);
          }
          return countryCompare;
        });
        
        setGestures(sortedGestures);
        
        // Sort country names alphabetically
        const countryNames = [...new Set(sortedGestures.map(g => g.country_name))];
        setCountries(['All', ...countryNames.sort()]);
        
      } catch (error) {
        console.error("Error loading gesture data:", error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredGestures = selectedCountry === 'All'
    ? gestures
    : gestures.filter(g => g.country_name === selectedCountry);

  const handleGestureSelect = (gesture) => {
    setSelectedGesture(gesture);
    window.scrollTo(0, 0); // Scroll to top when a gesture is selected
  };

  const handleBackToGuide = () => {
    setSelectedGesture(null);
    window.scrollTo(0, 0); // Scroll to top when going back to the guide
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-slate-600">Loading Gesture Guide...</p>
            </div>
        </div>
    );
  }

  if (selectedGesture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={handleBackToGuide} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guide
          </Button>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedGesture.country_name === 'Japan' ? '🇯🇵' : 
                    selectedGesture.country_name === 'India' ? '🇮🇳' :
                    selectedGesture.country_name === 'Thailand' ? '🇹🇭' :
                    selectedGesture.country_name === 'France' ? '🇫🇷' :
                    selectedGesture.country_name === 'USA' ? '🇺🇸' :
                    selectedGesture.country_name === 'Italy' ? '🇮🇹' :
                    selectedGesture.country_name === 'South Korea' ? '🇰🇷' :
                    selectedGesture.country_name === 'Brazil' ? '🇧🇷' :
                    selectedGesture.country_name === 'China' ? '🇨🇳' :
                    selectedGesture.country_name === 'Russia' ? '🇷🇺' :
                    selectedGesture.country_name === 'Egypt' ? '🇪🇬' :
                    selectedGesture.country_name === 'Mexico' ? '🇲🇽' :
                    selectedGesture.country_name === 'Germany' ? '🇩🇪' :
                    selectedGesture.country_name === 'Spain' ? '🇪🇸' :
                    selectedGesture.country_name === 'Greece' ? '🇬🇷' :
                    selectedGesture.country_name === 'Australia' ? '🇦🇺' :
                    selectedGesture.country_name === 'Ethiopia' ? '🇪🇹' :
                    selectedGesture.country_name === 'New Zealand' ? '🇳🇿' :
                    selectedGesture.country_name === 'Tibet' ? '🏴' :
                    selectedGesture.country_name === 'Philippines' ? '🇵🇭' :
                    selectedGesture.country_name === 'Pakistan' ? '🇵🇰' :
                    selectedGesture.country_name === 'Canada' ? '🇨🇦' :
                    selectedGesture.country_name === 'Malaysia' ? '🇲🇾' :
                    '🌍'}</span>
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold">
                    {selectedGesture.country_name}
                  </Badge>
                </div>
                
                <CardTitle className="text-3xl font-bold text-slate-900 mb-3">
                  {selectedGesture.name}
                </CardTitle>
                
                <p className="text-lg text-slate-600 leading-relaxed">
                  {selectedGesture.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                      <Hand className="w-6 h-6 text-blue-500" />
                      How to Perform
                    </h3>
                    <div className="space-y-4">
                      {selectedGesture.steps?.map((step, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-8 h-8 flex-shrink-0 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">{step.title}</h4>
                            <p className="text-slate-700 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-xl text-green-700 flex items-center gap-2 mb-4">
                        <Check className="w-6 h-6" />
                        Cultural Do's
                      </h3>
                      <div className="space-y-3">
                        {selectedGesture.cultural_dos?.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-xl text-red-700 flex items-center gap-2 mb-4">
                        <X className="w-6 h-6" />
                        Cultural Don'ts
                      </h3>
                      <div className="space-y-3">
                        {selectedGesture.cultural_donts?.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl flex items-center justify-center">
              <Hand className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Cultural Gesture Guide</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Master respectful greetings and gestures from cultures around the world
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
            <Globe className="w-5 h-5 text-slate-500" />
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[250px] border-0 bg-transparent focus:ring-0 text-slate-700 font-medium">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country} className="font-medium">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredGestures.length === 0 ? (
          <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Hand className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No gestures found</h3>
              <p className="text-slate-600">No gestures available for the selected country.</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGestures.map(gesture => (
              <motion.div key={gesture.id} variants={itemVariants}>
                <Card 
                  onClick={() => handleGestureSelect(gesture)} 
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">
                        {gesture.country_name === 'Japan' ? '🇯🇵' : 
                         gesture.country_name === 'India' ? '🇮🇳' :
                         gesture.country_name === 'Thailand' ? '🇹🇭' :
                         gesture.country_name === 'France' ? '🇫🇷' :
                         gesture.country_name === 'USA' ? '🇺🇸' :
                         gesture.country_name === 'Italy' ? '🇮🇹' :
                         gesture.country_name === 'South Korea' ? '🇰🇷' :
                         gesture.country_name === 'Brazil' ? '🇧🇷' :
                         gesture.country_name === 'China' ? '🇨🇳' :
                         gesture.country_name === 'Russia' ? '🇷🇺' :
                         gesture.country_name === 'Egypt' ? '🇪🇬' :
                         gesture.country_name === 'Mexico' ? '🇲🇽' :
                         gesture.country_name === 'Germany' ? '🇩🇪' :
                         gesture.country_name === 'Spain' ? '🇪🇸' :
                         gesture.country_name === 'Greece' ? '🇬🇷' :
                         gesture.country_name === 'Australia' ? '🇦🇺' :
                         gesture.country_name === 'Ethiopia' ? '🇪🇹' :
                         gesture.country_name === 'New Zealand' ? '🇳🇿' :
                         gesture.country_name === 'Tibet' ? '🏴' :
                         gesture.country_name === 'Philippines' ? '🇵🇭' :
                         gesture.country_name === 'Pakistan' ? '🇵🇰' :
                         gesture.country_name === 'Canada' ? '🇨🇦' :
                         gesture.country_name === 'Malaysia' ? '🇲🇾' :
                         '🌍'}
                      </span>
                      <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold">
                        {gesture.country_name}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {gesture.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {gesture.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {gesture.steps?.length || 0} steps
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold"
                      >
                        Learn More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
