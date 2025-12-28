import { useEffect, useState } from "react";

export default function AutoSpotifyEmbed({ type, artistName, trackName, albumName }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [error, setError] = useState(null);
  
  const q = [artistName, trackName, albumName]
    .filter(Boolean)
    .join(" ");


  useEffect(() => {
    if (!["track", "album", "artist"].includes(type)) return;

    if (!q || !type) return;


    (async () => {
      try {
        setError(null);
        setEmbedUrl(null);

        const res = await fetch(`/api/spotify/search?type=${encodeURIComponent(type)}&q=${encodeURIComponent(q)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Search failed");
        setEmbedUrl(data?.match?.embed_url || null);
      } catch (e) {
        setError(String(e.message || e));
      }
    })();
  }, [q, type]);

  if (error) return <div style={{ color: "#777" }}>Spotify 검색 실패: {error}</div>;
  if (!embedUrl) return <div style={{ color: "#777" }}>검색 중...</div>;

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ borderRadius: 12, marginTop: 10 }}
      title="spotify-artist-embed"
    />
  );
}
