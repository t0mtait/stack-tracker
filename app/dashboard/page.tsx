'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, DarkThemeToggle, Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stack from '../stack/page'; 
import MyNav from '../../components/nav';
export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`/api/users?email=${user.email}`);
        const data = await response.json();
        
        if (data.success && data.users.length > 0) {
          const userRoles = data.users[0].roles;
          // Check if roles is an array or needs parsing
          const rolesArray = Array.isArray(userRoles) ? userRoles : JSON.parse(userRoles || '[]');
          setIsAdmin(rolesArray.includes('admin'));
          
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (!isLoading) {
      fetchUserRoles();
    }
  }, [user?.email, isLoading]);
 


  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      < MyNav />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.given_name || user?.name?.split(' ')[0] || 'User'}!
          </h2>
        </div>


        {/* Dashboard Cards */}
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* User Records Card */}
          {isAdmin && (
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  User Records
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage user accounts
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full" color="blue" onClick={() => router.push('/users')}>
                Manage Users
              </Button>
            </div>
          </Card> )}

          {/* Resources Card */}
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  FHIR Resources
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Browse all FHIR resources
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full" color="purple" onClick={() => router.push('/resources')}>
                Browse Resources
              </Button>
            </div>
          </Card>

          {/* Admin: Create Resource Card - Only show if admin */}
          {isAdmin && (
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Create Resource
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create a new FHIR resource
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full" color="green" onClick={() => router.push('/createresource')}>
                  Create Resource
                </Button>
              </div>
            </Card>
          )}
        </div>

        

        
        <Stack />
      </main>
    </div>
  );
}
