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

  const [form, setForm] = useState({
  picture: user?.picture || '',
  email: user?.email || '',
  username: user?.name || '',
  phone: user?.phone_number || '',
  userid: user?.sub || '',
  gender: user?.gender || '',
  givenname: user?.given_name || '',
  familyname: user?.family_name || '',
  address: user?.address || '',
});

  useEffect(() => {
  if (user) {
    setForm({
      picture: user.picture || '',
      email: user.email || '',
      username: user.name || '',
      phone: user.phone_number || '',
      userid: user.sub || '',
      gender: user.gender || '',
      givenname: user.given_name || '',
      familyname: user.family_name || '',
      address: user.address || '',
    });
  }
}, [user]);


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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Submitting user update form!");
  
  try {
    const response = await fetch('/api/auth0_user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      alert('Failed to update profile');
      console.error(data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Network error updating profile');
  }
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Label htmlFor="picture">Profile Picture</Label>
                <TextInput id="picture" value={form.picture} onChange={e => setForm(f => ({ ...f, picture: e.target.value }))} />
                <Label htmlFor="email">Email</Label>
                <TextInput
                  disabled
                  id="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
                <Label htmlFor="username">Username</Label>
                <TextInput id="username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                <Label htmlFor="userid">User ID</Label>
                <TextInput id="userid" value={form.userid} onChange={e => setForm(f => ({ ...f, userid: e.target.value }))} />
                <Label htmlFor="gender">Gender</Label>
                <TextInput id="gender" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} />
                <Label htmlFor="givenname">Given Name</Label>
                <TextInput id="givenname" value={form.givenname} onChange={e => setForm(f => ({ ...f, givenname: e.target.value }))} />
                <Label htmlFor="familyname">Family Name</Label>
                <TextInput id="familyname" value={form.familyname} onChange={e => setForm(f => ({ ...f, familyname: e.target.value }))} />
                <Label htmlFor="address">Address</Label>
                <TextInput id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                <Button className="mt-5 w-full cursor-pointer" type="submit">Save</Button>
              </form>
            </div>
          </Card>
        </div>  
      </main>
    </div>
  );
}
