'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Spinner } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Login from "@/components/Login";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <main className='antialiased flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900'>
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          HAPI FHIR Frontend
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Secure healthcare data management powered by FHIR
        </p>
        <Login />
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Sign in to access your healthcare dashboard
        </p>
      </div>
    </main>
  );
}
