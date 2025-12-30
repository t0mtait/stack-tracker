import { NextRequest, NextResponse } from "next/server";


export interface Resource {
    res_id: string;
    partition_id: string | null;
    res_deleted_at: string | null;
    res_version: number;
    has_tags: boolean;
    res_published: boolean;
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

export async function GET(request: NextRequest) {
    if (request.headers.get('id') == null) {
        try {
            console.log("No medication id header set. Fetching list of Medications.");
            const resp = await fetch(`${process.env.FHIR_BASE_URL}/Medication?_count=100`, {
            headers: { Accept: 'application/fhir+json' },
            });

            if (!resp.ok) {
            const body = await resp.text();
            return NextResponse.json(
                { success: false, error: 'Failed to fetch MedicationStatements', details: body },
                { status: resp.status },
            );
            }

            const bundle = await resp.json();
            const meds = (bundle.entry ?? []).map((e: any) => e.resource);
            return NextResponse.json({
            success: true,
            resources: meds,
            count: meds.length,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch medications',
                details: errorMessage,
            },
            { status: 500 },
            );
        }
    }
    else {
        const id = request.headers.get('id');
        try {
            console.log("Hitting ", `${process.env.FHIR_BASE_URL}/${id}`);
            const resp = await fetch(`${process.env.FHIR_BASE_URL}/${id}`, {
            headers: { Accept: 'application/fhir+json' },
            });

            if (!resp.ok) {
            const body = await resp.text();
            return NextResponse.json(
                { success: false, error: 'Failed to fetch Medication', details: body },
                { status: resp.status },
            );
            }
            const medication = await resp.json();
            console.log("medication content: ", medication);
            return NextResponse.json({
            success: true,
            body: medication,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch medication',
                details: errorMessage,
            },
            { status: 500 },
            );
        }
}
}

