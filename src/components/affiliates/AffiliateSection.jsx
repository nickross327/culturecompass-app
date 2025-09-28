
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BedDouble, Wifi, Map } from 'lucide-react';

const affiliateLinks = [
  {
    name: 'Find Your Stay',
    description: 'Book hotels and apartments at the best prices.',
    icon: BedDouble,
    partner: 'Expedia',
    url: (country) => `https://www.expedia.com/Hotel-Search?destination=${country}&siteid=1&langid=1033`,
    cta: 'Book Now',
    color: 'from-blue-500 to-blue-700'
  },
  {
    name: 'Stay Connected',
    description: 'Get affordable eSIMs to stay online abroad.',
    icon: Wifi,
    partner: 'Saily',
    url: (country) => `https://go.saily.site/aff_c?offer_id=101&aff_id=10409`,
    cta: 'Get eSIM',
    color: 'from-green-500 to-green-700'
  },
  {
    name: 'Book Tours',
    description: 'Discover and book amazing activities.',
    icon: Map,
    partner: 'GetYourGuide',
    url: (country) => `https://www.getyourguide.com/?partner_id=W9RTGTJ&utm_medium=online_publisher`,
    cta: 'Explore Tours',
    color: 'from-orange-500 to-orange-700'
  }
];

export default function AffiliateSection({ countryName }) {
  return (
    <Card className="bg-white rounded-xl shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Recommended Travel Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">Enhance your trip to {countryName} with these essential services from our trusted partners. These are affiliate links that help support CultureCompass at no extra cost to you.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {affiliateLinks.map((link) => (
            <a 
              key={link.name}
              href={link.url(countryName)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className={`p-6 rounded-lg text-white bg-gradient-to-br ${link.color} h-full flex flex-col justify-between hover:scale-105 transition-transform`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <link.icon className="w-6 h-6" />
                    <h4 className="font-bold text-lg">{link.name}</h4>
                  </div>
                  <p className="text-sm opacity-90 mb-4">{link.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold opacity-80">Partner: {link.partner}</span>
                  <Button variant="ghost" size="sm" className="bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 h-auto text-xs">
                    {link.cta} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
