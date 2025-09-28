import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Server, Cookie } from 'lucide-react';

export default function DataUsagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Data Usage</h1>
          </div>
          <p className="text-lg text-slate-600">
            How CultureCompass collects, uses, and protects your information
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Last updated: January 2025
          </p>
        </div>
        
        <div className="space-y-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                What We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-700">
              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Account Information</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Email address:</strong> Used for account creation, login, and essential communications</li>
                  <li><strong>Full name:</strong> Used for personalization and account identification</li>
                  <li><strong>Profile preferences:</strong> Language preferences, notification settings</li>
                  <li><strong>Subscription status:</strong> Whether you have a Pro membership, trial information</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Learning Activity</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Countries explored:</strong> Which cultural guides you've accessed</li>
                  <li><strong>Bookmarked phrases:</strong> Your saved phrases and personal notes</li>
                  <li><strong>Progress tracking:</strong> Learning streaks, achievements, quiz results</li>
                  <li><strong>Travel plans:</strong> Itineraries created with our AI planner</li>
                  <li><strong>Cultural insights viewed:</strong> Which etiquette guides you've accessed</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Community Interactions</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Cultural Pulse contributions:</strong> Tips and insights you share with other users</li>
                  <li><strong>Upvotes and interactions:</strong> Content you've liked or engaged with</li>
                  <li><strong>Username and location:</strong> Optional information for community features</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Technical Information</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Device information:</strong> Browser type, operating system, screen resolution</li>
                  <li><strong>Usage analytics:</strong> How you navigate through the app, time spent on features</li>
                  <li><strong>Location (general):</strong> Country/city level location for relevant cultural content</li>
                  <li><strong>Error logs:</strong> Technical issues to help us improve app performance</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" />
                How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-700">
              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Core Features</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Personalized experience:</strong> Recommend relevant countries and cultural content</li>
                  <li><strong>Progress tracking:</strong> Show your learning achievements and streaks</li>
                  <li><strong>Bookmarks and notes:</strong> Save and sync your important phrases across devices</li>
                  <li><strong>Travel planning:</strong> Generate personalized itineraries based on your interests</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Communication</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Service updates:</strong> Important announcements about new features or changes</li>
                  <li><strong>Support responses:</strong> Replying to your questions and feedback</li>
                  <li><strong>Educational content:</strong> Cultural tips and travel advice (with your consent)</li>
                  <li><strong>Account security:</strong> Alerts about login activity or security issues</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Improvement and Analytics</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Product development:</strong> Understanding which features are most helpful</li>
                  <li><strong>Performance optimization:</strong> Identifying and fixing technical issues</li>
                  <li><strong>Content curation:</strong> Adding new countries and cultural insights based on demand</li>
                  <li><strong>Security monitoring:</strong> Detecting and preventing fraudulent activity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Data Sharing and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-700">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">What We DON'T Do</h4>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  <li>We never sell your personal information to advertisers</li>
                  <li>We don't share your private bookmarks or notes with anyone</li>
                  <li>We don't track you across other websites or apps</li>
                  <li>We don't use your data for targeted advertising</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Limited Data Sharing</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Service providers:</strong> Trusted partners like Stripe (payments) and hosting services</li>
                  <li><strong>Anonymized analytics:</strong> Aggregate statistics without personal identifiers</li>
                  <li><strong>Legal requirements:</strong> Only when required by law or court order</li>
                  <li><strong>Business transfers:</strong> In the unlikely event of company sale or merger</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Community Features</h4>
                <p className="mb-2">When you use our Cultural Pulse feature:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Your chosen username (typically first name) is visible to other users</li>
                  <li>Tips and insights you share are public to help other travelers</li>
                  <li>You can report inappropriate content for moderation</li>
                  <li>All content is subject to our community guidelines</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-blue-500" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Essential Cookies</h4>
                <p className="mb-2">These cookies are necessary for the app to function:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Authentication tokens to keep you logged in</li>
                  <li>Session management for a smooth user experience</li>
                  <li>Security cookies to prevent fraud and abuse</li>
                  <li>Preference settings (language, theme, etc.)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Analytics Cookies</h4>
                <p className="mb-2">With your consent, we use cookies to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Understand how you use different features</li>
                  <li>Identify popular content and countries</li>
                  <li>Measure app performance and load times</li>
                  <li>Track conversion rates for improvements</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Your Control</h4>
                <p className="text-blue-700 text-sm">
                  You can manage your cookie preferences through your browser settings. 
                  Disabling certain cookies may affect app functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                Data Security and Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Security Measures</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Access controls:</strong> Limited employee access on a need-to-know basis</li>
                  <li><strong>Regular audits:</strong> Security reviews and vulnerability assessments</li>
                  <li><strong>Secure hosting:</strong> Data stored in SOC 2 compliant data centers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">Data Retention</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Active accounts:</strong> Data retained as long as your account is active</li>
                  <li><strong>Deleted accounts:</strong> Personal data deleted within 30 days of account deletion</li>
                  <li><strong>Legal requirements:</strong> Some data retained longer if required by law</li>
                  <li><strong>Anonymized data:</strong> May be retained indefinitely for research and improvement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-slate-900">International Transfers</h4>
                <p>
                  Your data may be processed in countries outside your residence, including the United States and European Union. 
                  We ensure appropriate safeguards are in place for all international data transfers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">You have the right to:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Access:</strong> Request a copy of your data</li>
                  <li><strong>Correct:</strong> Update inaccurate information</li>
                  <li><strong>Delete:</strong> Request deletion of your account and data</li>
                  <li><strong>Control:</strong> Manage your privacy and notification preferences</li>
                  <li><strong>Export:</strong> Download your bookmarks and travel plans</li>
                </ul>
              </div>
              
              <div>
                <p className="text-sm">
                  <strong>To exercise these rights:</strong> Contact us at <strong>info@culturecompass.app</strong> 
                  or use the account deletion feature in your settings. We'll respond within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}