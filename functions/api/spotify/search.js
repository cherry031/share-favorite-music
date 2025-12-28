export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const type = url.searchParams.get("type") || "artist"; // artist | track | album | playlist
  const limit = url.searchParams.get("limit") || "1";

  if (!q) {
    return json({ error: "Missing query param: q" }, 400);
  }

  // 1) Access token (Client Credentials Flow)
  const token = await getSpotifyAccessToken(env);

  // 2) Search API call
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.searchParams.set("q", q);
  searchUrl.searchParams.set("type", type);
  searchUrl.searchParams.set("limit", limit);

  const res = await fetch(searchUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    return json({ error: "Spotify search failed", status: res.status, detail: text }, 502);
  }

  const data = await res.json();

  // best match 1개만 반환 (type별로 key가 다름)
  const key = `${type}s`; // artists, tracks, albums, playlists
  const items = data?.[key]?.items || [];
  const best = items[0];

  if (!best) {
    return json({ q, type, match: null }, 200);
  }

  // embed URL 생성 (type에 맞게)
  const embedUrl = `https://open.spotify.com/embed/${type}/${best.id}`;

  return json({
    q,
    type,
    match: {
      id: best.id,
      name: best.name,
      spotify_url: best.external_urls?.spotify,
      embed_url: embedUrl,
      image: best.images?.[0]?.url,
    },
  });
}

async function getSpotifyAccessToken(env) {
  // Spotify 토큰 엔드포인트는 accounts.spotify.com/api/token 사용 (Client Credentials) :contentReference[oaicite:7]{index=7}
  const creds = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
