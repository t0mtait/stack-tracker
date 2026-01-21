// app/api/auth0_user/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[auth0_user] Incoming body:', body);

    const {
      picture,
      email,
      username,
      phone,
      userid,
      gender,
      givenname,
      familyname,
      address,
    } = body;

    console.log('[auth0_user] Requesting management token for user:', userid);

    const tokenRes = await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
          grant_type: 'client_credentials',
        }),
      }
    );

    console.log('[auth0_user] Token response status:', tokenRes.status);

    if (!tokenRes.ok) {
      const errorBody = await tokenRes.text();
      console.error('[auth0_user] Failed to get management token:', errorBody);
      return NextResponse.json(
        { error: 'Failed to get management token' },
        { status: 500 }
      );
    }

    const { access_token } = await tokenRes.json();
    console.log('[auth0_user] Got management token');

    const patchBody: any = {
      picture,
      email,
      given_name: givenname,
      family_name: familyname,
      user_metadata: {
        gender,
        address,
        phone,
        display_name: username,
    },
  };

    Object.keys(patchBody).forEach((k) => {
      if (patchBody[k] === undefined) delete patchBody[k];
    });

    console.log('[auth0_user] Patch body to Auth0:', patchBody);

    const userRes = await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(
        userid
      )}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchBody),
      }
    );

    console.log('[auth0_user] User patch status:', userRes.status);

    const data = await userRes.json();
    console.log('[auth0_user] User patch response body:', data);

    if (!userRes.ok) {
      return NextResponse.json(data, { status: userRes.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('[auth0_user] Unexpected server error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
