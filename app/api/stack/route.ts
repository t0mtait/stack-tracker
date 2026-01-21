import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_email,
      id,
      dosageValue,
      dosageUnit,
      dosesPerWeek,
    } = body as {
      user_email: string;
      id: string;
      dosageValue: string | number;
      dosageUnit: string;
      dosesPerWeek: string | number;
    };

    const response = await fetch(
      `http://localhost:3000/api/users?email=${encodeURIComponent(user_email)}`
    );
    const data = await response.json();

    if (data.success && data.users.length > 0) {
      const fhir_patient_id = data.users[0].fhir_patient_id;

      const resource = {
        resourceType: 'MedicationStatement',
        id: id || 'generated-id',
        subject: {
          reference: 'Patient/' + fhir_patient_id,
        },
        status: 'active',
        medicationReference: { reference: 'Medication/' + id },
        dosage: [
          {
            text: '5 g once daily',
            timing: {
              repeat: {
                frequency: Number(dosesPerWeek) || 0,
                period: 1,
                periodUnit: 'wk',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: Number(dosageValue) || 0,
                  unit: dosageUnit || 'units',
                  system: 'http://unitsofmeasure.org',
                  code: dosageUnit || 'g',
                },
              },
            ],
          },
        ],
      };


      const fhirUrl = `${process.env.FHIR_BASE_URL}/${resource.resourceType}`;
      const resp = await fetch(fhirUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/fhir+json',
          Accept: 'application/fhir+json',
        },
        body: JSON.stringify(resource),
      });

      const responseBody = await resp.text();

      if (!resp.ok) {
        console.error('FHIR server error:', {
          status: resp.status,
          statusText: resp.statusText,
          body: responseBody,
          url: fhirUrl,
        });

        return NextResponse.json(
          {
            success: false,
            error: `Failed to create resource (${resp.status})`,
            details: responseBody,
            fhirUrl,
          },
          { status: resp.status }
        );
      }

      const created = JSON.parse(responseBody);
      return NextResponse.json(
        { success: true, resource: created },
        { status: 201 }
      );
    } else {
      console.error('User not found for email:', user_email, data);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Error creating resource',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}


export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      dosageValue,
      dosageUnit,
      dosesPerWeek,
    } = body as {
      id: string;
      dosageValue: string | number;
      dosageUnit: string;
      dosesPerWeek: string | number;
    };

    const fhirUrl = `${process.env.FHIR_BASE_URL}/MedicationStatement/${id}`;
    const patchBody = [
      {
        op: 'replace',
        path: '/dosage/0/timing/repeat',
        value: {
          frequency: Number(dosesPerWeek) || 0,
          period: 1,
          periodUnit: 'wk',
        },
      },
      {
        op: 'replace',
        path: '/dosage/0/doseAndRate/0/doseQuantity',
        value: {
          value: Number(dosageValue) || 0,
          unit: dosageUnit || 'units',
          system: 'http://unitsofmeasure.org',
          code: dosageUnit || 'g',
        },
      },
    ];


    const resp = await fetch(fhirUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json',
        Accept: 'application/fhir+json',
      },
      body: JSON.stringify(patchBody),
    });


    const responseBody = await resp.text();

    if (!resp.ok) {
      console.error('FHIR server error on PATCH:', {
        status: resp.status,
        statusText: resp.statusText,
        body: responseBody,
        url: fhirUrl,
      });

      return NextResponse.json(
        {
          success: false,
          error: `Failed to update resource (${resp.status})`,
          details: responseBody,
          fhirUrl,
        },
        { status: resp.status }
      );
    }

    const updated = JSON.parse(responseBody);
    return NextResponse.json(
      { success: true, resource: updated },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Error updating resource',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}