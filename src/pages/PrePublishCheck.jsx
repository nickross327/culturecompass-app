import React, { useState, useEffect } from 'react';
import { Countries } from '@/api/entities';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';

const CheckItem = ({ name, status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failure':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'failure':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} flex items-start gap-4`}>
      <div className="mt-1">{getStatusIcon()}</div>
      <div>
        <p className="font-semibold text-slate-800">{name}</p>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default function PrePublishCheckPage() {
  const { user, isLoadingUser } = useAuth();
  const [checks, setChecks] = useState([
    { id: 'countryCount', name: 'Country Count Validation', status: 'pending', message: 'Waiting to start...' },
    { id: 'placeholders', name: 'Placeholder Text Check', status: 'pending', message: 'Waiting to start...' },
    { id: 'adminControls', name: 'Admin Controls Visibility Check', status: 'pending', message: 'Waiting to start...' },
    { id: 'legalLinks', name: 'Legal Links Presence Check', status: 'pending', message: 'Waiting to start...' },
  ]);
  const [overallStatus, setOverallStatus] = useState('pending');
  const [isRunning, setIsRunning] = useState(false);

  const updateCheck = (id, status, message) => {
    setChecks(prev => prev.map(c => (c.id === id ? { ...c, status, message } : c)));
  };

  const runChecks = async () => {
    setIsRunning(true);
    setOverallStatus('running');

    // 1. Check Country Count
    updateCheck('countryCount', 'running', 'Fetching countries from the database...');
    try {
      const countries = await Countries.list();
      if (countries.length >= 20) {
        updateCheck('countryCount', 'success', `Validation passed with ${countries.length} countries.`);
      } else {
        updateCheck('countryCount', 'failure', `FAIL: Found only ${countries.length} countries. Expected >= 20.`);
      }
    } catch (e) {
      updateCheck('countryCount', 'failure', `FAIL: Error fetching countries: ${e.message}`);
    }
    
    // Fetch the Browse page content to perform HTML checks
    let pageHtml = '';
    try {
        const response = await fetch(createPageUrl('Browse'));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        pageHtml = await response.text();
    } catch(e) {
        updateCheck('placeholders', 'failure', `FAIL: Could not fetch Browse page for analysis. ${e.message}`);
        updateCheck('adminControls', 'failure', 'FAIL: Could not fetch Browse page for analysis.');
        updateCheck('legalLinks', 'failure', 'FAIL: Could not fetch Browse page for analysis.');
        setIsRunning(false);
        setOverallStatus('failure');
        return; // Stop checks if page can't be fetched
    }

    // 2. Check for placeholder text
    updateCheck('placeholders', 'running', 'Scanning for "Coming soon" or "Select an item"...');
    const placeholderRegex = /Coming soon|Select an item/i;
    if (placeholderRegex.test(pageHtml)) {
      updateCheck('placeholders', 'failure', 'FAIL: Found forbidden placeholder text like "Coming soon" in the rendered UI.');
    } else {
      updateCheck('placeholders', 'success', 'Validation passed. No forbidden placeholder text found.');
    }

    // 3. Check for admin controls visible to non-admins (approximated)
    // This check assumes non-admins see the same public page. We look for a "+" symbol that might indicate an "add" button.
    updateCheck('adminControls', 'running', 'Scanning for admin-only controls on public page...');
    const adminControlRegex = /\+<\/span>|PlusCircle/i; // Look for "+" text or PlusCircle icon name
    if (adminControlRegex.test(pageHtml)) {
        updateCheck('adminControls', 'failure', 'FAIL: Found potential admin-only controls (like a "+" button) on the publicly rendered page.');
    } else {
        updateCheck('adminControls', 'success', 'Validation passed. No obvious admin controls found.');
    }

    // 4. Check for legal links
    updateCheck('legalLinks', 'running', 'Scanning for links to Privacy Policy and Terms...');
    const hasPrivacy = pageHtml.includes('PrivacyPolicy');
    const hasTerms = pageHtml.includes('TermsAndConditions');
    if (hasPrivacy && hasTerms) {
      updateCheck('legalLinks', 'success', 'Validation passed. Links to legal pages are present.');
    } else {
      updateCheck('legalLinks', 'failure', `FAIL: Missing legal links. Privacy Found: ${hasPrivacy}, Terms Found: ${hasTerms}`);
    }

    setIsRunning(false);
  };
  
  useEffect(() => {
      if(isRunning) return;
      const hasFailure = checks.some(c => c.status === 'failure');
      const isComplete = checks.every(c => c.status === 'success' || c.status === 'failure');

      if(isComplete) {
          setOverallStatus(hasFailure ? 'failure' : 'success');
      }
  }, [checks, isRunning]);

  if (isLoadingUser) {
    return <div className="p-6">Loading...</div>;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-600">This page is for administrative use only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">Pre-Publish Validation</h1>
        </div>

        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Build Readiness Checks</CardTitle>
            <p className="text-slate-600">Run these automated checks to ensure the app meets quality standards before release.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {checks.map(check => (
              <CheckItem key={check.id} {...check} />
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4">
          <Button onClick={runChecks} disabled={isRunning} className="px-8 py-6 text-lg">
            {isRunning ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Running Checks...
              </>
            ) : 'Start Pre-Publish Checks'}
          </Button>
          
          {overallStatus === 'success' && (
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg text-center">
              <h3 className="font-bold text-lg">✅ Build Approved</h3>
              <p>All automated checks passed. The application is ready for release.</p>
            </div>
          )}
          {overallStatus === 'failure' && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg text-center">
              <h3 className="font-bold text-lg">❌ Build Failed</h3>
              <p>One or more checks failed. Please resolve the issues before release.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}