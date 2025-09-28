import React, { useState, useEffect } from 'react';
import { Favorites as FavoritesEntity } from '@/api/entities';
import { Countries } from '@/api/entities';
import { Rules } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2, Globe, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/components/auth/AuthProvider';

export default function FavoritesPage() {
  const { user, isLoadingUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [rulesData, setRulesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load user's favorites and all countries/rules data
        const [userFavorites, countries, rules] = await Promise.all([
          FavoritesEntity.filter({ userId: user.id }),
          Countries.list(),
          Rules.list()
        ]);
        
        setFavorites(userFavorites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setCountriesData(countries);
        setRulesData(rules);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoadingUser) {
      loadFavorites();
    }
  }, [user, isLoadingUser]);

  const getCountryData = (iso2) => {
    return countriesData.find(country => country.iso2 === iso2);
  };

  const getRuleData = (ruleId) => {
    return rulesData.find(rule => rule.id === ruleId);
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await FavoritesEntity.delete(favoriteId);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const groupedFavorites = favorites.reduce((acc, favorite) => {
    const country = getCountryData(favorite.country);
    const countryName = country ? country.name : 'Unknown Country';
    
    if (!acc[countryName]) {
      acc[countryName] = {
        country: country,
        favorites: []
      };
    }
    acc[countryName].favorites.push(favorite);
    return acc;
  }, {});

  if (isLoadingUser || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid gap-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
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
            <CardTitle className="text-center flex items-center gap-2 justify-center">
              <Heart className="w-6 h-6 text-red-500" />
              Sign In Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">Please sign in to view your favorite countries and cultural tips.</p>
            <Button onClick={() => User.login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to={createPageUrl("Browse")}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
            <p className="text-slate-600">Your saved countries and cultural insights</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No favorites yet</h2>
              <p className="text-slate-600 mb-6">
                Start exploring countries and save your favorite cultural insights!
              </p>
              <Link to={createPageUrl("Browse")}>
                <Button>
                  <Globe className="w-4 h-4 mr-2" />
                  Explore Countries
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
            </div>

            {Object.entries(groupedFavorites).map(([countryName, data]) => (
              <div key={countryName}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{data.country?.emojiFlag || '🌍'}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{countryName}</h2>
                    <Badge variant="outline">{data.favorites.length} favorite{data.favorites.length !== 1 ? 's' : ''}</Badge>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {data.favorites.map((favorite) => {
                    const rule = favorite.rule ? getRuleData(favorite.rule) : null;
                    
                    return (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {rule ? (
                                  // Specific rule favorite
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={
                                        rule.type === 'Do' 
                                          ? "bg-green-100 text-green-700 border-green-200" 
                                          : "bg-red-100 text-red-700 border-red-200"
                                      }>
                                        {rule.type === 'Do' ? '✅ Do' : '❌ Don\'t'}
                                      </Badge>
                                    </div>
                                    <p className="text-lg text-slate-900 mb-2">{rule.text}</p>
                                  </div>
                                ) : (
                                  // General country favorite
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                        Country Guide
                                      </Badge>
                                    </div>
                                    <p className="text-lg text-slate-900 mb-2">
                                      Complete cultural guide for {countryName}
                                    </p>
                                    {data.country?.summary && (
                                      <p className="text-sm text-slate-600">{data.country.summary}</p>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                  <span>Saved {formatDate(favorite.createdAt)}</span>
                                  <Link to={createPageUrl("Browse")} className="hover:text-blue-600">
                                    View in Browse →
                                  </Link>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFavorite(favorite.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}