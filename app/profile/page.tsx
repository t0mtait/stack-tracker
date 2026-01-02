'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, DarkThemeToggle, Spinner, TextInput, FileInput, Label} from 'flowbite-react';
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
      <main className="mx-auto max-w-l px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info Section */}
        <div className="mt-8">
          <Card>
            <p className="text-2xl font-medium text-gray-900 dark:text-white">
              Account Information
            </p>
            <p className="text-sm text-black dark:text-white mb-2">
                <span className="font-medium">Last Updated:</span> {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            <div className="space-y-2">
              <form>
                <Label htmlFor="picture">Profile Picture</Label>
                <TextInput id="pictureurl" value={user?.picture || ''} />
                <Label htmlFor="email">Email</Label>
                <TextInput id="email" value={user?.email || ''} />
                <Label htmlFor="username">Username</Label>
                <TextInput id="username" value={user?.name || ''} />
                <Label htmlFor="phone">Phone Number</Label>
                <TextInput id="phone" value={user?.phone_number || ''} />
                <Label htmlFor="userid">User ID</Label>
                <TextInput id="userid" value={user?.sub || ''} />
                <Label htmlFor="gender">Gender</Label>
                <TextInput id="gender" value={user?.gender || ''} />
                <Label htmlFor="givenname">Given Name</Label>
                <TextInput id="givenname" value={user?.given_name || ''} />
                <Label htmlFor="familyname">Family Name</Label>
                <TextInput id="familyname" value={user?.family_name || ''} />
                <Label htmlFor="address">Address</Label>
                <TextInput id="address" value={user?.address || ''} />
                <Button className="mt-5 w-full cursor-pointer" type="submit">Save</Button>
              </form>
            </div>
          </Card>
        </div>  
      </main>
    </div>
  );
}
