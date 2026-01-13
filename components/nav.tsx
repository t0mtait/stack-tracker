'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, DarkThemeToggle, Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyNav() {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const handleLogout = () => {
        logout({
        logoutParams: {
            returnTo: window.location.origin
        }
        });
    };
    return ( 
        <div>
            <header className="bg-white shadow dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">

                    {/*  home icon */}
                    <img onClick={ () => router.push('/dashboard')} className="h-10 w-10 mr-3 cursor-pointer text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400" src="../public/home-icon.png" />
                    
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Stack Tracker
                    </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        {user?.picture && (
                        <img
                            className="h-8 w-8 rounded-full cursor-pointer"
                            src={user.picture}
                            alt={user.name || 'User'}
                            onClick={ () => router.push('/profile')}
                        />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.name || user?.email}
                        </span>
                    </div>

                    <svg viewBox="0 0 24 24" onClick={ () => handleLogout() } className="h-8 w-8 mr-3 cursor-pointer text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 20H6C4.89543 20 4 19.1046 4 18L4 6C4 4.89543 4.89543 4 6 4H14M10 12H21M21 12L18 15M21 12L18 9" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                    
                    <DarkThemeToggle />
                    </div>
                </div>
                </div>
                </header>
          </div> 
    );
}