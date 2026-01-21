'use client';

import MyNav from '@/components/nav';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, Spinner, Alert, DarkThemeToggle } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddToStack from '@/components/addtostack';


interface Resource {
    id: string;
    status: string;
    res_deleted_at: string | null;
    code: {
        text:  string;
    };
    meta: {
        lastUpdated: string;
    }
    form?: {
        text: string;
    };
    manufacturer?: {
        display: string;
    };
}

export default function Resources() {
    const { user, isAuthenticated, isLoading, logout} = useAuth0();
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchResources();
        }
    }, [isAuthenticated]);

    const handleDelete = async (resourceId: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/deleteresource', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resourceType: 'Medication', id: resourceId }),
            });
            const data = await response.json();
            if (response.ok) {
                setResources((prevResources) =>
                    prevResources.filter((res) => res.id !== resourceId)
                );
            } else {
                setError(data.error || 'Failed to delete resource');
            }
        } catch (error) {
            setError('Failed to delete resource');
        } finally {
            setLoading(false);
        }
    };

    const fetchResources = async () => {
        try { 
            setLoading(true);
            setError(null);
            const response = await fetch('/api/resources');
            const data = await response.json();
            if (response.ok) {
                setResources(data.resources);
            } else {
                setError(data.error || 'Failed to fetch resources');
            }
        } catch (error) {
            setError('Failed to fetch resources');
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            }
        })
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Spinner size="xl" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
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
            <MyNav />

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <Alert color="failure" className="mb-6">
                        <span className="font-medium">Error!</span> {error}
                        <Button size="xs" color="gray" onClick={fetchResources} className="ml-4">
                            Retry
                        </Button>
                    </Alert>
                )}

                <div className="bg-white shadow dark:bg-gray-800 rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading resources...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-black dark:text-white divide-y divide-gray-200 dark:divide-gray-700">
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
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Form
                                        </th>
                                         <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Manufacturer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Last updated
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
                                    {resources.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No resources found in the database
                                            </td>
                                        </tr>
                                    ) : (
                                        resources.map((resourceData) => (
                                            <tr key={resourceData.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.code.text}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.form?.text || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.manufacturer?.display || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatDate(resourceData.meta.lastUpdated)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    <div className="flex flex-row gap-3">
                                                        <a
                                                            href={`http://localhost:8080/fhir/Medication/${resourceData.id}`}
                                                            rel="noopener noreferrer"
                                                            className="cursor-pointer text-blue-600 underline"
                                                        >
                                                        View
                                                        </a>
                                                        <a
                                                            className="cursor-pointer text-red-600 underline"
                                                            onClick={() => handleDelete(resourceData.id)}
                                                        >
                                                        Delete
                                                        </a>
                                                        <div className="cursor-pointer">
                                                            <AddToStack 
                                                            resourceId={resourceData.id}
                                                            supplementName={resourceData.code.text}
                                                            />
                                                        </div>
                                                    </div>
                                                        
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
    )
}
