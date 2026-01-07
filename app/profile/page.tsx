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

  const [formValues, setFormValues] = useState({
  pictureurl: '',
  email: '',
  username: '',
  phone: '',
  givenname: '',
  familyname: '',
});

useEffect(() => {
  if (user) {
    setFormValues({
      pictureurl: user.picture || '',
      email: user.email || '',
      username: user.name || '',
      phone: user.phone_number || '',
      givenname: user.given_name || '',
      familyname: user.family_name || '',
    });
  }
}, [user]);

const handleChange =
  (field: keyof typeof formValues) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({ ...prev, [field]: e.target.value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    const response = await fetch('/api/auth0_user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  userId: user?.sub,
  data: formValues,
}),
  
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert('Error updating profile: ' + JSON.stringify(result.error));
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
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
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
                <Label htmlFor="pictureurl">Picture URL</Label>
                <TextInput
  id="pictureurl"
  value={formValues.pictureurl}
  onChange={handleChange('pictureurl')}
/>

<Label htmlFor="email">Email</Label>
<TextInput
  id="email"
  value={formValues.email}
  onChange={handleChange('email')}
/>

<Label htmlFor="username">Username</Label>
<TextInput
  id="username"
  value={formValues.username}
  onChange={handleChange('username')}
/>

<Label htmlFor="phone">Phone Number</Label>
<TextInput
  id="phone"
  value={formValues.phone}
  onChange={handleChange('phone')}
/>

<Label htmlFor="givenname">Given Name</Label>
<TextInput
  id="givenname"
  value={formValues.givenname}
  onChange={handleChange('givenname')}
/>

<Label htmlFor="familyname">Family Name</Label>
<TextInput
  id="familyname"
  value={formValues.familyname}
  onChange={handleChange('familyname')}
/>

                
                <Button className="mt-5 w-full cursor-pointer" type="submit">Save</Button>
              </form>
            </div>
          </Card>
        </div>  
      </main>
    </div>
  );
}
