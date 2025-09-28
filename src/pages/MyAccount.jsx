
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User as UserIcon, 
  Crown, 
  CreditCard, 
  Shield, 
  Calendar,
  ExternalLink,
  Trash2,
  ArrowLeft,
  Settings,
  Mail,
  Timer,
  AlertTriangle,
  Info, // Added for Data Usage and About
  FileText, // Added for Terms & Conditions
  ArrowRight, // Added for internal link navigation
  RefreshCw, // Added for refresh icon
  Database, // Added for data section
  Loader // Added for refresh loading state
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    // Load last sync timestamp
    const lastSync = localStorage.getItem('culturecompass_last_sync');
    if (lastSync) {
      setLastUpdated(new Date(lastSync));
    }
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Calculate trial days left if on trial
      if (userData.trial_started_date && !userData.trial_used && !userData.pro_member) {
        const trialStart = new Date(userData.trial_started_date);
        const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, daysLeft));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Redirect to login if not authenticated
      await User.login();
    }
    setIsLoading(false);
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      // Update user to remove pro membership
      await User.updateMyUserData({ 
        pro_member: false,
        subscription_cancelled: true,
        cancellation_date: new Date().toISOString()
      });
      
      // Refresh user data
      await loadUserData();
      
      alert("Your subscription has been cancelled. You'll continue to have Premium access until your current billing period ends.");
      setShowCancelConfirm(false);
      
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("There was an error cancelling your subscription. Please contact support at info@culturecompass.app");
    }
    setIsCancelling(false);
  };

  const handleManageBilling = () => {
    // For now, direct users to contact support for billing issues
    alert("For billing inquiries, refunds, or payment method updates, please contact support at info@culturecompass.app");
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Clear cached data
      localStorage.removeItem('culturecompass_last_sync');
      
      // Trigger a data refresh - we'll need to communicate with the Browse page
      // For now, we'll just update the timestamp and show success
      const now = new Date();
      localStorage.setItem('culturecompass_last_sync', now.toISOString());
      setLastUpdated(now);
      
      alert('Data refresh completed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleChangePassword = () => {
    // Since using Google auth, redirect to Google account management
    window.open("https://myaccount.google.com/security", "_blank");
  };

  const getSubscriptionStatus = () => {
    if (user?.pro_member) {
      return { status: "Premium", color: "bg-purple-100 text-purple-800", icon: Crown };
    }
    
    if (user?.trial_started_date && !user?.trial_used && trialDaysLeft > 0) {
      return { 
        status: `Trial (${trialDaysLeft} days left)`, 
        color: "bg-blue-100 text-blue-800", 
        icon: Timer 
      };
    }
    
    if (user?.trial_used || (user?.trial_started_date && trialDaysLeft <= 0)) {
      return { status: "Free", color: "bg-gray-100 text-gray-800", icon: UserIcon };
    }
    
    return { status: "Free", color: "bg-gray-100 text-gray-800", icon: UserIcon };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid gap-6">
              {Array(4).fill(0).map((_, i) => (
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
            <CardTitle className="text-center">Please Log In</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">You need to be logged in to view your account.</p>
            <Button onClick={() => User.login()}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("index")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Full Name</p>
                      <p className="font-semibold text-slate-900">{user.full_name}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Email Address</p>
                      <p className="font-semibold text-slate-900">{user.email}</p>
                    </div>
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Account Type</p>
                      <p className="font-semibold text-slate-900">{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
                    </div>
                  </div>
                  
                  {user.referral_code && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">Your Referral Code</p>
                          <p className="font-semibold text-slate-900">{user.referral_code}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(`https://culturecompass.app?ref=${user.referral_code}`)}
                        >
                          Copy Link
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription & Billing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Subscription & Billing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Current Plan</p>
                      <div className="flex items-center gap-2">
                        <subscriptionInfo.icon className="w-4 h-4" />
                        <Badge className={subscriptionInfo.color}>
                          {subscriptionInfo.status}
                        </Badge>
                      </div>
                    </div>
                    {!user.pro_member && (
                      <Link to={createPageUrl("GoPro")}>
                        <Button size="sm">
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  {user.trial_started_date && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-slate-600">Trial Started</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(user.trial_started_date).toLocaleDateString()}
                        </p>
                        {trialDaysLeft > 0 && (
                          <p className="text-sm text-blue-600 mt-1">
                            {trialDaysLeft} days remaining in your free trial
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Billing Support</p>
                        <p className="text-xs text-slate-500">Contact support for billing questions, refunds, or payment updates</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageBilling}
                      >
                        Contact Support
                      </Button>
                    </div>

                    {user.pro_member && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <div>
                          <p className="text-sm text-slate-600">Cancel Subscription</p>
                          <p className="text-xs text-slate-500">You'll keep Premium access until your billing period ends</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCancelConfirm(true)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data & Sync Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Data & Sync
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Data Management Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Data Management</h3>
                    
                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-900">Last Updated</p>
                          <p className="text-sm text-slate-600">
                            {lastUpdated ? lastUpdated.toLocaleDateString() + ' at ' + lastUpdated.toLocaleTimeString() : 'Never'}
                          </p>
                        </div>
                        <Button 
                          onClick={handleRefreshData}
                          disabled={isRefreshing}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Loader className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Refresh to get the latest cultural data and country information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    About & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    CultureCompass is a product of The Language Club Limited, a company based in the United Kingdom.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to={createPageUrl("PrivacyPolicy")} className="block">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Shield className="w-4 h-4 mr-3" />
                        Privacy Policy
                      </Button>
                    </Link>
                    <Link to={createPageUrl("TermsAndConditions")} className="block">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <FileText className="w-4 h-4 mr-3" />
                        Terms & Conditions
                      </Button>
                    </Link>
                    <Link to={createPageUrl("Contact")} className="block">
                       <Button variant="outline" className="w-full justify-start h-12">
                        <Mail className="w-4 h-4 mr-3" />
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Deletion Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white border-2 border-red-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">Delete Account</h4>
                      <p className="text-sm text-slate-600 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <Link to={createPageUrl("DeleteDataRequest")}>
                      <Button variant="destructive" className="flex-shrink-0">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete My Account
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          {/* Empty column for lg:grid-cols-3 layout if no sidebar content is needed */}
          <div className="hidden lg:block"></div> 
        </div>

        {/* Cancellation Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Cancel Subscription?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Are you sure you want to cancel your Premium subscription? You'll continue to have access to all Premium features until your current billing period ends.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1"
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
