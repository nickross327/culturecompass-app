import React, { useState } from 'react';
import { InvokeLLM } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpandableInsight({ countryName, insightCategory, insightText, children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailedContent, setDetailedContent] = useState('');

  const handleExpand = async () => {
    if (detailedContent) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setIsExpanded(true);

    try {
      const prompt = `As a world-class cultural expert for the travel app 'CultureCompass', provide a detailed and insightful explanation for the following tip about ${countryName} regarding ${insightCategory}:\n\nTip: "${insightText}"\n\nYour explanation should be engaging, easy to understand for a traveler, and about 2-3 paragraphs long. Dive into the 'why' behind the custom, mention nuances, and offer practical advice. Do not repeat the original tip in your answer. Start the explanation directly.`;
      
      const response = await InvokeLLM({ prompt, add_context_from_internet: true });
      setDetailedContent(response);
    } catch (error) {
      console.error("Error fetching detailed insight:", error);
      setDetailedContent("Sorry, we couldn't load more details at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-base text-gray-700">
        {children}
        <div className="flex justify-end mt-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
                {isLoading ? (
                    <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {detailedContent ? (isExpanded ? 'Show Less' : 'Show More') : 'Learn More'}
                        {detailedContent && (isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
                    </>
                )}
            </Button>
        </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="prose prose-sm max-w-none mt-3 pt-3 border-t border-dashed border-blue-200 text-slate-800">
              {isLoading ? (
                 <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                 </div>
              ) : (
                <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: detailedContent.replace(/\*/g, '') }} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}