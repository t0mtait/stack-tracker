'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, Spinner, Alert, DarkThemeToggle, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MedicationStatement {
  id: number;
  supplement: string;
  dosage: { timing: { repeat: { frequency: string; periodUnit: string } } }[];
  medicationReference: { reference: string };
  meta: { lastUpdated: string };
  status: string;


}

export default function Stack() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const router = useRouter();
  const [medicationStatements, setMedicationStatements] = useState<MedicationStatement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [medicationNames, setMedicationNames] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedicationStatements ();
    }
  }, [isAuthenticated]);

  const fetchMedicationStatements = async () => {
    try {
      const response = await fetch('/api/medicationstatement');
      const data = await response.json();

      if (data.success) {
        const resources: MedicationStatement[] = data.resources;
        setMedicationStatements(resources);

    
        const entries = await Promise.all(
          resources.map(async (med) => {
            const ref = med.medicationReference.reference; 
            const name = await getMedicationName(ref);
            return [ref, name] as const;
          })
        );

          setMedicationNames(Object.fromEntries(entries));
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Network error: Unable to fetch users');
        console.error('Error fetching users:', err);
      }
    };

    const getMedicationName = async (reference: string) => {
        try {
            const response = await fetch(`/api/medication?id=${reference}`);
            const resjson = await response.json();

            console.log("Medication fetch data:", resjson.resources[0].code.text);
            if (resjson.success) {
                return resjson.resources[0].code.text
            } else {
                return 'Unknown Medication';
            }
        } catch (err) {
            console.error('Error fetching medication name:', err);
            return 'Unknown Medication';
        }
    };

  return (
    <div className="overflow-x-auto py-8">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Statement ID</TableHeadCell>
            <TableHeadCell>Frequency</TableHeadCell>
            <TableHeadCell>Medication</TableHeadCell>
            <TableHeadCell>Last Updated</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {medicationStatements.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell>{medication.id}</TableCell>
              <TableCell>{medication.dosage[0].timing.repeat.frequency} / {medication.dosage[0].timing.repeat.periodUnit.toUpperCase()}</TableCell>
              <TableCell>
                {medicationNames[medication.medicationReference.reference] ?? 'Loading...'}
              </TableCell>

              <TableCell>{new Date(medication.meta.lastUpdated).toLocaleDateString()}</TableCell>
              <TableCell>{medication.status}</TableCell>
              <TableCell>
                <a href={`http://fhir/MedicationStatement/${medication.id}`}>
                  <Button color="blue" size="sm">View</Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
          {error && (
            <TableRow>
              <TableCell colSpan={5}>
                <Alert color="failure">{error}</Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


