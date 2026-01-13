'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, TextInput, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AddToStackProps {
  resourceId: string;
  supplementName: string;
}

export default function AddToStack({ resourceId, supplementName }: AddToStackProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (isLoading) {
      console.log('Auth still loading');
      return;
    }
    if (!isAuthenticated || !user?.email) {
      console.error('User not authenticated or missing email');
      setError('You must be logged in');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const dosageValue = formData.get('dosesize');
    const dosageUnit = formData.get('dosesizeunit');
    const dosesPerWeek = formData.get('dosesperweek');

    setLoading(true);
    try {
      const res = await fetch('/api/stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resourceId,
          dosageValue,
          dosageUnit,
          dosesPerWeek,
          user_email: user.email,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Add to Stack failed:', res.status, text);
        setError('Failed to add to stack');
        return;
      }

      // success: close modal, maybe refresh
      setOpen(false);
      router.refresh?.();
    } catch (err) {
      console.error('Add to Stack error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  console.log('Auth0 state', {
    user,
    isAuthenticated,
    isLoading,
  });


  return (
    <>
      <a
        onClick={() => setOpen(true)}
        className="cursor-pointer text-blue-600 underline"
      >Add</a>

      <Modal show={open} size="md" onClose={() => setOpen(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Dosage information: {supplementName}
            </h3>
            <form onSubmit={handleAdd}>
              <div className="flex gap-2 mb-3">
                <TextInput
                  className="w-1/2"
                  type="number"
                  id="dosesize"
                  name="dosesize"
                  placeholder="Dose size"
                  required
                />
                <TextInput
                  className="w-1/2"
                  type="text"
                  id="dosesizeunit"
                  name="dosesizeunit"
                  placeholder="Dose unit"
                  required
                />
              </div>

              <TextInput
                type="number"
                id="dosesperweek"
                name="dosesperweek"
                placeholder="Doses / week"
                required
                className="mb-3"
              />
              

              {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                Add to Stack
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
