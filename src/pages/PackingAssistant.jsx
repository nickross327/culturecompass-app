import React, { useState, useEffect, useRef } from "react";
import { User } from "@/api/entities";
import { Country } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Luggage,
  Sparkles,
  Loader,
  ChevronDown,
  MapPin,
  CalendarDays,
  Plane,
  Sun,
  Cloudy,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

const tripTypes = [
  { value: "vacation", label: "Casual Vacation", icon: <Plane className="w-4 h-4" /> },
  { value: "business", label: "Business Trip", icon: <Briefcase className="w-4 h-4" /> },
  { value: "adventure", label: "Adventure/Hiking", icon: <Cloudy className="w-4 h-4" /> },
  { value: "beach", label: "Beach/Resort", icon: <Sun className="w-4 h-4" /> },
];

export default function PackingAssistantPage() {
  const [user, setUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [packingList, setPackingList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const [formData, setFormData] = useState({
    destination: "",
    duration: "7",
    tripType: "vacation"
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

      const isPro = userData.pro_member;
      let hasActiveTrial = false;
      if (!isPro && userData.trial_started_date && !userData.trial_used) {
        const trialEndDate = new Date(userData.trial_started_date);
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        if (new Date() < trialEndDate) hasActiveTrial = true;
      }

      if (!isPro && !hasActiveTrial) {
        window.location.href = createPageUrl("GoPro");
        return;
      }

      const countriesData = await Country.list();
      const uniqueCountriesMap = new Map();
      countriesData.forEach(country => uniqueCountriesMap.set(country.name, country));
      setCountries(Array.from(uniqueCountriesMap.values()));
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      window.location.href = createPageUrl("GoPro");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'destination') {
      if (value) {
        const filtered = countries.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
        setDestinationSuggestions(filtered.slice(0, 5));
      } else {
        setDestinationSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (value) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setDestinationSuggestions([]);
  };
  
  const handleCheckItem = (category, itemName) => {
    const key = `${category}-${itemName}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generatePackingList = async () => {
    if (!formData.destination) {
      alert("Please select a destination.");
      return;
    }
    setIsGenerating(true);
    setPackingList(null);
    setCheckedItems({});

    try {
      const [countryData] = await Country.filter({ name: formData.destination });
      
      const prompt = `Create a smart, culturally-aware packing list for a trip.
        
        **Trip Details:**
        - Destination: ${formData.destination}
        - Duration: ${formData.duration} days
        - Trip Type: ${formData.tripType}

        **Cultural & Environmental Context for ${countryData.name}:**
        - General Dress Code: ${countryData.dress_code || "Standard Western attire is generally acceptable, but be modest when visiting religious sites."}
        - Cultural Dos: ${countryData.cultural_dos ? countryData.cultural_dos.join(', ') : "Be polite and respectful."}
        - Local Language: ${countryData.language}
        - Currency: ${countryData.currency}

        Based on this, generate a JSON packing list. Provide a brief 'reason' for each item, especially culturally-specific ones. Include weather-appropriate clothing.
      `;

      const responseSchema = {
        type: "object",
        properties: {
          essentials: {
            type: "array",
            description: "Absolute must-have documents and items.",
            items: {
              type: "object",
              properties: { item: { type: "string" }, reason: { type: "string" } },
              required: ["item", "reason"]
            }
          },
          clothing: {
            type: "array",
            description: "Clothing recommendations based on weather, duration, and activities.",
            items: {
              type: "object",
              properties: { item: { type: "string" }, quantity: {type: "string"}, reason: { type: "string" } },
              required: ["item", "quantity", "reason"]
            }
          },
          toiletries_health: {
            type: "array",
            description: "Personal care and health-related items.",
            items: {
              type: "object",
              properties: { item: { type: "string" }, reason: { type: "string" } },
              required: ["item", "reason"]
            }
          },
          electronics: {
            type: "array",
            description: "Gadgets, chargers, and accessories.",
            items: {
              type: "object",
              properties: { item: { type: "string" }, reason: { type: "string" } },
              required: ["item", "reason"]
            }
          },
          cultural_specific: {
            type: "array",
            description: "Items specifically recommended for this destination's culture.",
            items: {
              type: "object",
              properties: { item: { type: "string" }, reason: { type: "string" } },
              required: ["item", "reason"]
            }
          }
        },
        required: ["essentials", "clothing", "electronics", "cultural_specific"]
      };

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true, // For real-time weather
        response_json_schema: responseSchema
      });

      setPackingList(response);

    } catch (error) {
      console.error("Error generating packing list:", error);
      alert("Sorry, there was an error generating your packing list. Please try again.");
    }

    setIsGenerating(false);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto" ref={wrapperRef}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center">
              <Luggage className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Smart Packing Assistant</h1>
          </div>
          <p className="text-lg text-slate-600">
            Get AI-powered packing lists tailored to your destination's weather, customs, and activities.
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Create Your Packing List</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Japan"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                autoComplete="off"
              />
              {destinationSuggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                  {destinationSuggestions.map((country) => (
                    <div
                      key={country.id}
                      onClick={() => handleSuggestionClick(country.name)}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-lg">{country.flag_emoji}</span>
                      <span>{country.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tripType">Trip Type</Label>
              <Select value={formData.tripType} onValueChange={(value) => handleInputChange('tripType', value)}>
                <SelectTrigger id="tripType"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tripTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-4 text-center">
               <Button onClick={generatePackingList} disabled={isGenerating || !formData.destination} className="btn-primary w-full md:w-auto px-8">
                {isGenerating ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate List</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isGenerating && (
          <div className="text-center p-8">
            <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-slate-600">Checking the weather and consulting cultural experts...</p>
          </div>
        )}
        
        <AnimatePresence>
          {packingList && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Your Packing List for {formData.destination}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" defaultValue={["essentials", "clothing", "cultural_specific"]} className="w-full">
                    {Object.entries(packingList).map(([category, items]) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="capitalize text-lg font-semibold">
                          {category.replace(/_/g, ' ')}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            {items.map((item, index) => (
                              <div key={index} className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg">
                                <Checkbox
                                  id={`${category}-${index}`}
                                  checked={checkedItems[`${category}-${item.item}`]}
                                  onCheckedChange={() => handleCheckItem(category, item.item)}
                                  className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label htmlFor={`${category}-${index}`} className={`font-medium ${checkedItems[`${category}-${item.item}`] ? 'line-through text-slate-500' : ''}`}>
                                    {item.item} {item.quantity && `(x${item.quantity})`}
                                  </label>
                                  <p className="text-xs text-slate-500">{item.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}