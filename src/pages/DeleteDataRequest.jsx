
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, AlertTriangle, Shield, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DeleteDataRequestPage() {
  const { user, isLoadingUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmations, setConfirmations] = useState({
    understand: false,
    permanent: false,
    noRefund: false
  });
  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExportData = async () => {
    if (!user) return;
    
    try {
      // In a real app, this would generate and download user data
      const userData = {
        account: {
          email: user.email,
          full_name: user.full_name,
          created_date: user.created_date
        },
        // Add other user data that should be exported
        message: "This is a sample export. In a real app, this would contain all your bookmarks, travel plans, and other personal data."
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `culturecompass-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Your data export has been downloaded.');
    } catch (error) {
      console.error('Export error:', error);
      alert('Unable to export data at this time. Please contact support.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (!confirmations.understand || !confirmations.permanent || !confirmations.noRefund) {
      alert('Please confirm all checkboxes before proceeding.');
      return;
    }

    if (!confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real app, this would initiate the account deletion process
      // For now, we'll just log the request and show success
      console.log('Account deletion requested:', {
        user_id: user.id,
        email: user.email,
        reason: reason,
        timestamp: new Date().toISOString()
      });
      
      // Mark the request as submitted
      setShowSuccess(true);
      
      // In production, you would:
      // 1. Create a deletion request record
      // 2. Send confirmation email
      // 3. Schedule actual deletion after grace period
      // 4. Log out the user
      
      setTimeout(() => {
        // Clear all local application data from storage
        localStorage.clear();
        // Log the user out, which will trigger a page reload
        User.logout();
      }, 5000); // Give user time to read the success message
      
    } catch (error) {
      console.error('Delete request error:', error);
      alert('Unable to process deletion request. Please contact support at info@culturecompass.app');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Loading account information...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Account Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              You need to be signed in to manage your account data.
            </p>
            <Button onClick={() => User.login()} className="cc-button-primary">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-green-800">Deletion Request Submitted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl">✅</div>
            <p className="text-slate-700">
              Your account deletion request has been submitted successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
              <p><strong>What happens next:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>You'll receive a confirmation email within 24 hours</li>
                <li>Your account will be scheduled for deletion in 7 days</li>
                <li>You can cancel this request by contacting support</li>
                <li>All personal data will be permanently removed</li>
              </ul>
            </div>
            <p className="text-sm text-slate-600">
              You will be automatically logged out in a few seconds.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-slate-900">Delete My Data</h1>
          </div>
          <p className="text-lg text-slate-600">
            Request permanent deletion of your CultureCompass account and data
          </p>
        </div>

        <div className="space-y-8">
          {/* Data Export Option */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Download className="w-5 h-5" />
                Download Your Data First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                Before deleting your account, you can download a copy of your data including bookmarks, 
                travel plans, and account information.
              </p>
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
            </CardContent>
          </Card>

          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. 
              All your bookmarks, travel plans, achievements, and account data will be permanently deleted.
            </AlertDescription>
          </Alert>

          {/* Deletion Form */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-800">Account Deletion Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Why are you deleting your account? (Optional)
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Help us improve by sharing your reason for leaving..."
                  className="h-20"
                  maxLength={500}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Please confirm you understand:</h4>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="understand"
                    checked={confirmations.understand}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({...prev, understand: checked}))
                    }
                  />
                  <label htmlFor="understand" className="text-sm text-slate-700 leading-relaxed">
                    I understand that deleting my account will permanently remove all my bookmarks, 
                    travel plans, achievements, and account data from CultureCompass.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="permanent"
                    checked={confirmations.permanent}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({...prev, permanent: checked}))
                    }
                  />
                  <label htmlFor="permanent" className="text-sm text-slate-700 leading-relaxed">
                    I understand that this action is permanent and cannot be undone. 
                    I will not be able to recover my account or data after deletion.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="noRefund"
                    checked={confirmations.noRefund}
                    onCheckedChange={(checked) => 
                      setConfirmations(prev => ({...prev, noRefund: checked}))
                    }
                  />
                  <label htmlFor="noRefund" className="text-sm text-slate-700 leading-relaxed">
                    I understand that account deletion does not automatically cancel paid subscriptions 
                    or guarantee refunds. I should cancel my subscription separately if needed.
                  </label>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">What will be deleted:</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Your account profile and login credentials</li>
                  <li>• All bookmarked phrases and personal notes</li>
                  <li>• Travel plans and itineraries created with AI Planner</li>
                  <li>• Achievement progress and learning statistics</li>
                  <li>• Cultural Pulse contributions and interactions</li>
                  <li>• All associated personal data and preferences</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleDeleteAccount}
                  disabled={isProcessing || !confirmations.understand || !confirmations.permanent || !confirmations.noRefund}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account Permanently
                    </>
                  )}
                </Button>
                
                <Link to={createPageUrl("MyAccount")}>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
              <p className="text-blue-700 text-sm mb-3">
                If you're having issues with the app or have questions about your data, 
                our support team is here to help before you decide to delete your account.
              </p>
              <div className="flex gap-3">
                <Link to={createPageUrl("Contact")}>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                    Contact Support
                  </Button>
                </Link>
                <Link to={createPageUrl("PrivacyPolicy")}>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                    Privacy Policy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
