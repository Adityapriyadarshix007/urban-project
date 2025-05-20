
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockReports } from '@/data/mockData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const Admin = () => {
  const [isAuthenticated] = useState(true); // In a real app, this would check authentication

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor civic issues
          </p>
        </div>
        
        {isAuthenticated ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports Management</TabsTrigger>
              <TabsTrigger value="personnel">Personnel</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <AdminDashboard reports={mockReports} />
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Reports Management Module</h3>
                <p className="text-muted-foreground">
                  This section will include advanced report management tools.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="personnel">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Personnel Management</h3>
                <p className="text-muted-foreground">
                  Assign workers and manage team responsibilities.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">System Settings</h3>
                <p className="text-muted-foreground">
                  Configure application settings and notifications.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="max-w-2xl mx-auto py-12">
            <Alert variant="destructive" className="bg-destructive/10 mb-6">
              <ShieldAlert className="h-5 w-5" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You don't have permission to view this page. Please contact an administrator for access.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
