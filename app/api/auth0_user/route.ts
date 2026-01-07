import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { userId, data } = await req.json(); 

  const tokenRes = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });
  const { access_token } = await tokenRes.json();

  // 2. PATCH user
  const patchRes = await fetch(
    `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!patchRes.ok) {
    const err = await patchRes.json().catch(() => ({}));
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }

  const updatedUser = await patchRes.json();
  return NextResponse.json({ success: true, user: updatedUser });
}
