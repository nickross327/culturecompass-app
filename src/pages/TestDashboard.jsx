import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/api/entities';
import { Settings, UserPlus, ArrowRight, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TestDashboard() {

  const makeCurrentUserB2BAdmin = async () => {
    try {
      await User.updateMyUserData({ user_type: 'b2b_admin', company_id: 'test-company-id', company_name: 'TestCorp' });
      alert('You are now a B2B Admin for TestCorp. Please refresh the page to see the B2B Admin Dashboard link in the sidebar.');
      window.location.reload();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user type. Please check the console.');
    }
  };

  const resetUserType = async () => {
    try {
      await User.updateMyUserData({ user_type: 'b2c', company_id: null, company_name: null });
      alert('Your user type has been reset to B2C. Please refresh the page.');
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset user:', error);
      alert('Failed to reset user type. Please check the console.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FlaskConical className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Test Dashboard</h1>
            <p className="text-slate-600">Tools for testing application features.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                User Role Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Use these actions to test different user roles and their associated permissions throughout the app. A page refresh is required after changing roles.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={makeCurrentUserB2BAdmin}>
                  Make Me a B2B Admin
                </Button>
                <Button onClick={resetUserType} variant="outline">
                  Reset to Regular User
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Access B2B Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                You can directly access the B2B dashboard here. It has a built-in test mode that uses mock data if you are not a real B2B administrator.
              </p>
              <Link to={createPageUrl('B2BAdminDashboard')}>
                <Button variant="secondary" className="w-full">
                  Go to B2B Admin Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}