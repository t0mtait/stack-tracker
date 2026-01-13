'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, TextInput, Label, Checkbox, Dropdown, DropdownItem, Spinner, DarkThemeToggle} from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import MyNav from '@/components/nav';

interface Resource {
    res_id: string;
    partition_id: string | null;
    res_deleted_at: string | null;
    res_version: number;
    has_tags: boolean;
    res_published: string;
    res_updated: string;
    fhir_id: string;
    sp_has_links: boolean;
    hash_sha256: string;
    sp_index_status: number;
    res_language: string | null;
    sp_cmpstr_uniq_present: boolean;
    sp_cmptoks_present: boolean;
    sp_coords_present: boolean;
    sp_date_present: boolean;
    sp_number_present: boolean;
    sp_quantity_nrml_present: boolean;
    sp_quantity_present: boolean;
    sp_string_present: boolean;
    sp_token_present: boolean;
    sp_uri_present: boolean;
    partition_date: string | null;
    res_type: string;
    res_type_id : number;
    search_url_present: boolean;
    res_ver: string;

}

export default function CreateResource() {
    const { user, isAuthenticated, isLoading, logout} = useAuth0();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            }
        })
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const name = (document.getElementById('resource-name') as HTMLInputElement).value;
             const medication = {
                resourceType: 'Medication',
                status: 'active',
                code: {
                    text: name,   // supplement name
                },
                // add other fields from your form as needed
            };
            const response = await fetch('/api/createresource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medication),
            });
            const data = await response.json();
            if (data.success) {
                router.push('/resources');
            } else {
                setError(data.error || 'Failed to create resource');
            }
        } catch (error) {
            setError('An unexpected error occurred');
            setLoading(false);
            console.log(error);
            return;
        }
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

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

                <form className="flex max-w-md flex-col gap-4">
                    <div> 
                        <Label htmlFor="resource-name">Supplement</Label>
                        <TextInput
                            id="resource-name"
                            placeholder="Enter Supplement Name"
                            required={true}
                        />
                    </div>
                    
                    <Button type="submit" onClick={handleClick}>Submit</Button>
                </form>
                
            </main>
    </div>
  );
}