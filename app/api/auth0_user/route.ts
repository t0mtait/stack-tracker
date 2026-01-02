import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { userId, data } = await req.json(); 

  const tokenRes = await fetch(`https://YOUR_DOMAIN/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: `https://YOUR_DOMAIN/api/v2/`,
      grant_type: "client_credentials",
    }),
  });
  const { access_token } = await tokenRes.json();

  // 2. PATCH user
  const patchRes = await fetch(
    `https://YOUR_DOMAIN/api/v2/users/${encodeURIComponent(userId)}`,
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
