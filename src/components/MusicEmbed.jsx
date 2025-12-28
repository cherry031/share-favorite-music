import { useEffect, useState } from "react";

export default function AutoSpotifyArtistEmbed({ artistName }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistName) return;

    (async () => {
      try {
        setError(null);
        setEmbedUrl(null);

        const res = await fetch(`/api/spotify/search?type=artist&q=${encodeURIComponent(artistName)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Search failed");
        setEmbedUrl(data?.match?.embed_url || null);
      } catch (e) {
        setError(String(e.message || e));
      }
    })();
  }, [artistName]);

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
