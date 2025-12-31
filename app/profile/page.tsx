'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, DarkThemeToggle, Spinner, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MyNav />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info Section */}
        <div className="mt-8">
          <Card>
            <p className="text-2xl font-medium text-gray-900 dark:text-white">
              Account Information
            </p>
            <p className="text-sm text-gray-600 dark:text-white mb-2">
                <span className="font-medium">Last Updated:</span> {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            <div className="space-y-2">
              <form>
                <p>Email</p>
                <TextInput value={user?.email || ''} />
                <p>Username</p>
                <TextInput value={user?.name || ''} />
                <p>Phone Number</p>
                <TextInput value={user?.phone_number || ''} />
                <p>User ID</p>
                <TextInput value={user?.sub || ''} />
                <p>Gender</p>
                <TextInput value={user?.gender || ''} />
                <p>Given Name</p>
                <TextInput value={user?.given_name || ''} />
                <p>Family Name</p>
                <TextInput value={user?.family_name || ''} />
                <p>Address</p>
                <TextInput value={user?.address || ''} />
                <Button type="submit">Save</Button>
              </form>
            </div>
          </Card>
        </div>  
      </main>
    </div>
  );
}
