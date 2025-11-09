import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleAdmin() {
  const navigate = useNavigate();

  // Simple check - in development, we'll just log to console
  useEffect(() => {
    console.log('SimpleAdmin component mounted');
    return () => {
      console.log('SimpleAdmin component unmounted');
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    // Just redirect to home for now
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Admin Panel</CardTitle>
            <CardDescription>This is a simplified admin interface</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Development Mode</h3>
                <p>This is a simplified admin interface that bypasses all authentication in development.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="flex gap-2">
                  <Button>Manage Users</Button>
                  <Button variant="outline">View Reports</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
