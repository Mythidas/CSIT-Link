import { dev } from '$app/environment';
import { AV_ID, AV_SC } from '$env/static/private';

export async function GET({ cookies }) {
  try {
    const jwt = cookies.get("av_jwt_token");
    const pt = cookies.get("av_pt_token");
    if (jwt && pt) {
      return Response.json({ data: "Cookie Validated" }, { status: 200 });
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AV_ID,
      client_secret: AV_SC,
      scope: 'token'
    });

    const token_api = await fetch("https://id.sophos.com/api/v2/oauth2/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const token_data = await token_api.json();
    
    if (!token_api.ok) {
      return Response.json({
        error: {
          message: "Failed to get av tokens (AV/Token)",
          object: token_data
        } 
      });
    }

    const pt_api = await fetch("https://api.central.sophos.com/whoami/v1", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token_data.access_token}`
      }
    });
    const pt_data = await pt_api.json();

    if (!pt_api.ok) {
      return Response.json({
        error: {
          message: "Failed to get av tokens (AV/Token)",
          object: pt_data
        } 
      });
    }

    cookies.set("av_pt_token", pt_data.id, {
      path: "/",
      maxAge: 3600,
      httpOnly: true,
      secure: !dev,
      sameSite: "strict"
    })
    cookies.set("av_jwt_token", token_data.access_token, {
      path: "/",
      maxAge: 3600,
      httpOnly: true,
      secure: !dev,
      sameSite: "strict"
    });

    return Response.json({ data: "Tokens saved" }, { status: 200 });
  } catch {
    return Response.json({ error: { message: "Failed to get av tokens (AV/Token)" }}, { status: 500 });
  }
}