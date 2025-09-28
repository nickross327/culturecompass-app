
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Building, MapPin, Globe, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
          </div>
          <p className="text-lg text-slate-600">
            Have questions, feedback, or need support? We'd love to hear from you!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <p className="text-lg font-semibold text-slate-900 mb-2">Primary Contact:</p>
                <p className="text-2xl font-bold text-blue-700 mb-3">info@culturecompass.app</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span><strong>General inquiries:</strong> Use the email above</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span><strong>Business partnerships:</strong> Include "Partnership" in subject</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span><strong>Technical support:</strong> Include "Support" in subject</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <div>
                <p className="font-semibold text-lg text-slate-900 mb-3">The Language Club Limited</p>
                <p className="text-slate-600 mb-4">CultureCompass is proudly developed and operated by The Language Club Limited, a UK-based company specializing in language learning and cultural education technology.</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-slate-500" />
                  <div>
                    <p className="font-medium">Registered Address:</p>
                    <p className="text-slate-600">London, United Kingdom</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">General Questions</h3>
              <p className="text-sm text-slate-600 mb-3">
                Questions about features, pricing, or how CultureCompass works
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Business Inquiries</h3>
              <p className="text-sm text-slate-600 mb-3">
                Enterprise solutions, partnerships, or bulk licensing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Technical Support</h3>
              <p className="text-sm text-slate-600 mb-3">
                Bug reports, account issues, or technical difficulties
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-0 shadow-lg mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What to Include in Your Message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2 text-slate-900">For Support Issues:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Your account email address</li>
                  <li>• Device type and operating system</li>
                  <li>• Description of the problem</li>
                  <li>• Steps you've already tried</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-slate-900">For Feature Requests:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Clear description of desired feature</li>
                  <li>• How it would benefit users</li>
                  <li>• Any similar features in other apps</li>
                  <li>• Your use case or scenario</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
