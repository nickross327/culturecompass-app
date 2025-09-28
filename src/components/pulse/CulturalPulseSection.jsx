
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CulturalPulse } from '@/api/entities';
import { User } from '@/api/entities';
import { 
  Radio, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Clock,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CulturalPulseSection({ countryName, user }) {
  const [pulses, setPulses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newPulse, setNewPulse] = useState({
    content: '',
    pulse_type: 'tip',
    city_name: ''
  });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [error, setError] = useState('');

  const loadPulses = useCallback(async () => {
    if (!countryName) return;
    
    setLoading(true);
    try {
      const data = await CulturalPulse.filter({ country_name: countryName });
      const sortedPulses = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setPulses(sortedPulses);
    } catch (error) {
      console.error('Error loading cultural pulse:', error);
      setError('Unable to load cultural insights at the moment.');
    } finally {
      setLoading(false);
    }
  }, [countryName]); // Depend on countryName

  useEffect(() => {
    loadPulses();
  }, [loadPulses]); // Depend on the memoized loadPulses function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      User.login();
      return;
    }

    if (newPulse.content.trim().length < 10) {
      setError('Please provide at least 10 characters of useful information.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await CulturalPulse.create({
        country_name: countryName,
        city_name: newPulse.city_name || null,
        content: newPulse.content.trim(),
        pulse_type: newPulse.pulse_type,
        source_username: user.full_name?.split(' ')[0] || 'Anonymous', // First name only for privacy
        upvotes: 0
      });

      setNewPulse({ content: '', pulse_type: 'tip', city_name: '' });
      setShowSubmissionForm(false);
      loadPulses(); // Reload to show new pulse
      
      // Show success message
      alert('Thank you for sharing your cultural insight! It will help fellow travelers.');
    } catch (error) {
      console.error('Error submitting pulse:', error);
      setError('Unable to submit your insight. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (pulseId) => {
    if (!user) {
      User.login();
      return;
    }

    try {
      const pulse = pulses.find(p => p.id === pulseId);
      if (pulse) {
        await CulturalPulse.update(pulseId, {
          upvotes: (pulse.upvotes || 0) + 1
        });
        loadPulses(); // Reload to show updated count
      }
    } catch (error) {
      console.error('Error upvoting pulse:', error);
    }
  };

  const handleReport = async (pulseId) => {
    if (!user) {
      User.login();
      return;
    }

    if (confirm('Are you sure you want to report this content as inappropriate?')) {
      try {
        // In a real app, this would create a moderation report
        // For now, we'll just log it and show a message
        console.log(`Content reported by ${user.email}: Pulse ID ${pulseId}`);
        alert('Thank you for your report. Our team will review this content shortly.');
      } catch (error) {
        console.error('Error reporting content:', error);
      }
    }
  };

  const getPulseIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'tip':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'user_submission':
        return <Users className="w-5 h-5 text-green-500" />;
      default:
        return <Radio className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPulseColor = (type) => {
    switch (type) {
      case 'alert':
        return 'border-red-200 bg-red-50';
      case 'tip':
        return 'border-blue-200 bg-blue-50';
      case 'user_submission':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <Card className="cc-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Radio className="w-6 h-6 text-blue-500" />
            Cultural Pulse
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time insights and tips from travelers currently in {countryName}
          </p>
        </CardHeader>
        <CardContent>
          {!showSubmissionForm ? (
            <Button 
              onClick={() => setShowSubmissionForm(true)}
              className="w-full cc-button-primary"
              disabled={!user}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {user ? 'Share Your Cultural Insight' : 'Sign In to Contribute'}
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={newPulse.pulse_type}
                  onValueChange={(value) => setNewPulse({...newPulse, pulse_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type of insight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tip">💡 Cultural Tip</SelectItem>
                    <SelectItem value="alert">⚠️ Important Alert</SelectItem>
                    <SelectItem value="user_submission">📝 Personal Experience</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="text"
                  placeholder="City (optional)"
                  value={newPulse.city_name}
                  onChange={(e) => setNewPulse({...newPulse, city_name: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Textarea
                placeholder="Share something useful for fellow travelers..."
                value={newPulse.content}
                onChange={(e) => setNewPulse({...newPulse, content: e.target.value})}
                className="h-20"
                maxLength={500}
              />
              {error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="cc-button-primary">
                  {submitting ? 'Sharing...' : 'Share Insight'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowSubmissionForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {pulses.map((pulse) => (
              <motion.div
                key={pulse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border-2 ${getPulseColor(pulse.pulse_type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getPulseIcon(pulse.pulse_type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {pulse.source_username || 'Anonymous Traveler'}
                        </span>
                        {pulse.city_name && (
                          <Badge variant="outline" className="text-xs">
                            {pulse.city_name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(pulse.created_date)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Moderation - Report Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleReport(pulse.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="Report inappropriate content"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {pulse.content}
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpvote(pulse.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                    disabled={!user}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{pulse.upvotes || 0}</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {pulses.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No cultural insights yet for {countryName}.</p>
              <p className="text-sm">Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
