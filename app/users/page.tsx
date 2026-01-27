'use client';

import MyNav from '@/components/nav';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, Spinner, Alert, DarkThemeToggle } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    fhir_patient_id: string;
    username: string;
    email: string;
    auth0_user_id: string;
    roles: any; // JSON field
    profile_info: any; // JSON field
    created_at: string;
    updated_at: string;
}

export default function Users() {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            setError(null);
            
            const response = await fetch('/api/users');
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users);
            } else {
                setError(data.error || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Network error: Unable to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Spinner size="xl" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
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
            <main className="mx-auto max-w-2/3 px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <Alert color="failure" className="mb-6">
                        <span className="font-medium">Error!</span> {error}
                        <Button size="xs" color="gray" onClick={fetchUsers} className="ml-4">
                            Retry
                        </Button>
                    </Alert>
                )}

                <div className="bg-white shadow dark:bg-gray-800 rounded-lg overflow-hidden">
                    {loadingUsers ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading users...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            FHIR ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Username
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Email
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Auth0 ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Roles
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Profile Info.
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Created at
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Last modified
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No users found in the database
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((userData) => (
                                            <tr key={userData.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userData.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userData.fhir_patient_id || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userData.username}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userData.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userData.auth0_user_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {Array.isArray(userData.roles) 
                                                        ? userData.roles.join(', ') 
                                                        : userData.roles || 'No roles assigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userData.profile_info 
                                                        ? (userData.profile_info.name || userData.profile_info.email || 'Profile data available')
                                                        : 'No profile info'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatDate(userData.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatDate(userData.updated_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <a
                                                            href={`https://manage.auth0.com/dashboard/us/${process.env.NEXT_PUBLIC_AUTH0_TENANT}/users`}
                                                            rel="noopener noreferrer"
                                                            className="cursor-pointer text-blue-600 underline"
                                                        >
                                                        View
                                                        </a>
                                                </td>
                                                    
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
