
import React, { useState, useEffect } from "react";
import { Country } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Heart, 
  Utensils, 
  AlertTriangle, 
  Handshake,
  Gift,
  Shirt,
  Globe,
  Users,
  Coins
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const insightIcons = {
  cultural_highlights: Heart,
  dining_etiquette: Utensils,
  gesture_warnings: AlertTriangle,
  business_etiquette: Handshake,
  gift_giving: Gift,
  dress_code: Shirt,
  tipping_culture: Coins
};

const insightColors = {
  cultural_highlights: "text-red-500 bg-red-50 border-red-200",
  dining_etiquette: "text-orange-500 bg-orange-50 border-orange-200",
  gesture_warnings: "text-red-600 bg-red-100 border-red-300",
  business_etiquette: "text-blue-500 bg-blue-50 border-blue-200",
  gift_giving: "text-pink-500 bg-pink-50 border-pink-200",
  dress_code: "text-purple-500 bg-purple-50 border-purple-200",
  tipping_culture: "text-green-500 bg-green-50 border-green-200"
};

export default function CulturalInsightsPage() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await Country.list();
      setCountries(data);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
    setIsLoading(false);
  };

  const getAllInsights = () => {
    const insights = [];
    countries.forEach(country => {
      // Cultural highlights
      if (country.cultural_highlights && country.cultural_highlights.length > 0) {
        country.cultural_highlights.forEach(highlight => {
          insights.push({
            id: `${country.id}-cultural-${highlight.slice(0, 20)}`,
            country: country.name,
            flag: country.flag_emoji,
            type: 'cultural_highlights',
            title: 'Cultural Highlight',
            content: highlight
          });
        });
      }

      // Dining etiquette
      if (country.dining_etiquette && country.dining_etiquette.length > 0) {
        country.dining_etiquette.forEach(rule => {
          insights.push({
            id: `${country.id}-dining-${rule.slice(0, 20)}`,
            country: country.name,
            flag: country.flag_emoji,
            type: 'dining_etiquette',
            title: 'Dining Etiquette',
            content: rule
          });
        });
      }

      // Gesture warnings
      if (country.gesture_warnings && country.gesture_warnings.length > 0) {
        country.gesture_warnings.forEach(warning => {
          insights.push({
            id: `${country.id}-gesture-${warning.slice(0, 20)}`,
            country: country.name,
            flag: country.flag_emoji,
            type: 'gesture_warnings',
            title: 'Gesture Warning',
            content: warning
          });
        });
      }

      // Business etiquette
      if (country.business_etiquette && country.business_etiquette.length > 0) {
        country.business_etiquette.forEach(rule => {
          insights.push({
            id: `${country.id}-business-${rule.slice(0, 20)}`,
            country: country.name,
            flag: country.flag_emoji,
            type: 'business_etiquette',
            title: 'Business Etiquette',
            content: rule
          });
        });
      }

      // Single item insights
      if (country.tipping_culture) {
        insights.push({
          id: `${country.id}-tipping`,
          country: country.name,
          flag: country.flag_emoji,
          type: 'tipping_culture',
          title: 'Tipping Culture',
          content: country.tipping_culture
        });
      }

      if (country.gift_giving) {
        insights.push({
          id: `${country.id}-gift`,
          country: country.name,
          flag: country.flag_emoji,
          type: 'gift_giving',
          title: 'Gift Giving',
          content: country.gift_giving
        });
      }

      if (country.dress_code) {
        insights.push({
          id: `${country.id}-dress`,
          country: country.name,
          flag: country.flag_emoji,
          type: 'dress_code',
          title: 'Dress Code',
          content: country.dress_code
        });
      }
    });

    return insights;
  };

  const filteredInsights = getAllInsights().filter(insight => {
    const matchesSearch = insight.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || insight.type === selectedType;
    return matchesSearch && matchesType;
  });

  const insightTypes = [
    { value: "all", label: "All Insights", icon: Globe },
    { value: "cultural_highlights", label: "Highlights", icon: Heart },
    { value: "dining_etiquette", label: "Dining", icon: Utensils },
    { value: "tipping_culture", label: "Tipping", icon: Coins },
    { value: "gesture_warnings", label: "Gestures", icon: AlertTriangle },
    { value: "business_etiquette", label: "Business", icon: Handshake },
    { value: "gift_giving", label: "Gifts", icon: Gift },
    { value: "dress_code", label: "Dress", icon: Shirt }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Cultural Insights</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover cultural nuances and social customs from around the world to travel with confidence and respect
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search insights or countries..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {insightTypes.map((type) => {
                const IconComponent = type.icon;
                const isActive = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-slate-500" />
          <p className="text-slate-600">
            Showing {filteredInsights.length} cultural insights
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map((insight) => {
            const IconComponent = insightIcons[insight.type] || Globe;
            const colorClass = insightColors[insight.type] || "text-slate-500 bg-slate-50 border-slate-200";
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{insight.flag}</span>
                        <div>
                          <Link 
                            to={createPageUrl(`Country?name=${encodeURIComponent(insight.country)}`)}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {insight.country}
                          </Link>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${colorClass.split(' ').slice(1).join(' ')}`}>
                        <IconComponent className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {insight.title}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {insight.content}
                    </p>
                    
                    {insight.type === 'gesture_warnings' && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        Important to remember
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No insights found</h2>
            <p className="text-slate-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
