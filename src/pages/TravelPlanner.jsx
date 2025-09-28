
import React, { useState, useEffect, useRef } from "react";
import { User } from "@/api/entities";
import { Country } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  Loader,
  Download,
  Share2,
  Star,
  Clock,
  Globe,
  Plane,
  ChevronLeft,
  ChevronRight,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";

const DURATION_OPTIONS = [
  "3 days",
  "5 days",
  "7 days",
  "1 week",
  "10 days",
  "2 weeks",
  "3 weeks",
  "1 month",
];

export default function TravelPlannerPage() {
  const [user, setUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [travelPlan, setTravelPlan] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    travelers: "1",
    budget: "moderate",
    interests: "",
    travelStyle: "balanced"
  });

  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    loadInitialData();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setDestinationSuggestions([]);
    }
  };

  const loadInitialData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Check if user has premium access (Pro member OR active trial)
      const isPro = userData.pro_member;
      let hasActiveTrial = false;
      
      if (!isPro && userData.trial_started_date && !userData.trial_used) {
        const trialEndDate = new Date(userData.trial_started_date);
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        if (new Date() < trialEndDate) {
          hasActiveTrial = true;
        }
      }

      // Only redirect if user has NO premium access at all
      if (!isPro && !hasActiveTrial) {
        window.location.href = createPageUrl("GoPro");
        return;
      }

      const countriesData = await Country.list();
      
      // Remove duplicate countries by name, keeping the most recent entry
      const uniqueCountriesMap = new Map();
      countriesData.forEach(country => {
        uniqueCountriesMap.set(country.name, country); // This will overwrite older entries with same name
      });
      const uniqueCountries = Array.from(uniqueCountriesMap.values());
      
      setCountries(uniqueCountries);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      // Only redirect to GoPro if user is not authenticated
      window.location.href = createPageUrl("GoPro");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'destination') {
      if (value) {
        const filtered = countries.filter(country =>
          country.name.toLowerCase().includes(value.toLowerCase())
        );
        setDestinationSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
      } else {
        setDestinationSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDestinationSuggestions([]);
  };

  const generateTravelPlan = async () => {
    if (!formData.destination || !formData.duration) {
      alert("Please fill in at least destination and duration");
      return;
    }

    setIsGenerating(true);
    setTravelPlan(null);

    try {
      const prompt = `Create a detailed travel itinerary for:
Destination: ${formData.destination}
Duration: ${formData.duration}
Number of travelers: ${formData.travelers}
Budget: ${formData.budget}
Interests: ${formData.interests || "General sightseeing"}
Travel style: ${formData.travelStyle}

Please include:
- Daily activities and recommendations
- Local cultural experiences
- Food and dining suggestions
- Transportation tips
- Budget considerations
- Cultural dos and don'ts
- Essential phrases if it's a non-English speaking destination

Make it practical, culturally aware, and tailored to their preferences.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true
      });

      // Remove all asterisks from the response content
      const cleanedContent = response.replace(/\*/g, '');

      const newTravelPlan = {
        destination: formData.destination,
        duration: formData.duration,
        travelers: formData.travelers,
        budget: formData.budget,
        content: cleanedContent, // Use the cleaned content
        generatedAt: new Date().toISOString()
      };

      setTravelPlan(newTravelPlan);

    } catch (error) {
      console.error("Error generating travel plan:", error);
      alert("Sorry, there was an error generating your travel plan. Please try again.");
    }

    setIsGenerating(false);
  };

  const downloadPlan = () => {
    if (!travelPlan) return;

    const content = `Travel Plan for ${travelPlan.destination}
Duration: ${travelPlan.duration}
Generated: ${new Date(travelPlan.generatedAt).toLocaleDateString()}

${travelPlan.content}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-plan-${travelPlan.destination.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading your travel planner...</p>
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
              <MapPin className="w-6 h-6 text-blue-600" />
              AI Travel Planner
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">Create personalized travel itineraries with AI assistance.</p>
            <Button onClick={() => User.login()}>Sign In to Plan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const nextStep = () => {
    // Basic validation before moving to next step
    if (step === 1 && !formData.destination) {
      alert("Please enter a destination to proceed.");
      return;
    }
    if (step === 2 && !formData.duration) {
      alert("Please select a duration to proceed.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const progress = (step / 4) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            key="step1" // Key for AnimatePresence
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><MapPin className="text-teal-500" />Destination</h3>
            <p className="text-slate-600 mb-6">Where do you want to go? Start typing to see suggestions.</p>
            <div className="relative">
              <Input
                placeholder="e.g., Tokyo, Japan"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                autoComplete="off"
              />
              {destinationSuggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                  {destinationSuggestions.map((country) => (
                    <div
                      key={country.id}
                      onClick={() => handleSuggestionClick('destination', country.name)}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-lg">{country.flag_emoji}</span>
                      <span>{country.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2" // Key for AnimatePresence
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Calendar className="text-teal-500" />Duration & Budget</h3>
            <p className="text-slate-600 mb-6">How long will your trip be and what's your spending style?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger><SelectValue placeholder="Select trip duration" /></SelectTrigger>
                <SelectContent>{DURATION_OPTIONS.map((duration) => (<SelectItem key={duration} value={duration}>{duration}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget-friendly</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3" // Key for AnimatePresence
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Compass className="text-teal-500" />Travel Style</h3>
            <p className="text-slate-600 mb-6">Who are you traveling with and what are your interests?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select value={formData.travelers} onValueChange={(value) => handleInputChange('travelers', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Solo (1 person)</SelectItem>
                  <SelectItem value="2">Couple (2 people)</SelectItem>
                  <SelectItem value="3-4">Small group (3-4 people)</SelectItem>
                  <SelectItem value="5+">Large group (5+ people)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.travelStyle} onValueChange={(value) => handleInputChange('travelStyle', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cultural">Cultural immersion</SelectItem>
                  <SelectItem value="adventure">Adventure & activities</SelectItem>
                  <SelectItem value="relaxation">Relaxation & leisure</SelectItem>
                  <SelectItem value="foodie">Food & dining focused</SelectItem>
                  <SelectItem value="balanced">Balanced mix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Specific Interests (optional): Museums, temples, nightlife, shopping, hiking..." value={formData.interests} onChange={(e) => handleInputChange('interests', e.target.value)} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4" // Key for AnimatePresence
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }} 
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Ready to Go?</h3>
            <p className="text-slate-600 mb-6">Let's create your personalized, culturally-aware travel plan!</p>
            <Button
              onClick={generateTravelPlan}
              disabled={isGenerating || !formData.destination || !formData.duration}
              className="btn-primary w-full text-lg py-6 relative overflow-hidden group"
            >
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white/20 rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Perfect Trip...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Travel Plan
                </>
              )}
            </Button>
          </motion.div>
        );
      default: return null;
    }
  }

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-6xl mx-auto" ref={wrapperRef}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 gradient-primary text-white rounded-2xl flex items-center justify-center">
              <Plane className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">AI Travel Planner</h1>
          </div>
          <p className="text-lg text-slate-600">
            Get personalized travel itineraries powered by AI and cultural insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Planning Form Wizard */}
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Plan Your Journey</CardTitle>
              <Progress value={progress} className="w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 min-h-[300px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <div className="text-sm text-slate-500">Step {step} of 4</div>
                <Button 
                  onClick={nextStep} 
                  disabled={step === 4 || (step === 1 && !formData.destination) || (step === 2 && !formData.duration)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Area */}
          <div className="space-y-6">
            {travelPlan ? (
              <>
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Your Travel Plan: {travelPlan.destination}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={downloadPlan}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm text-slate-600">
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {travelPlan.duration}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {travelPlan.travelers} travelers
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(travelPlan.generatedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-[80vh] overflow-y-auto">
                    <div className="prose prose-slate max-w-none">
                      <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                        {travelPlan.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white border-0 shadow-lg h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Plan Your Adventure?</h3>
                  <p className="text-slate-600 mb-6 max-w-md">
                    Fill out the form on the left to generate a personalized travel itinerary powered by AI and cultural insights.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 max-w-md">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI-powered recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Cultural insights included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Downloadable itineraries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>Tailored to your style</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
