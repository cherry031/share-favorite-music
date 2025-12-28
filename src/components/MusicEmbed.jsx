import { useEffect, useMemo, useState } from "react";

/** 1) Spotify 검색만 담당하는 훅 */
function useSpotifySearch({ q, type, enabled }) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    match: null, // { id, name, embed_url, spotify_url, image }
  });

  useEffect(() => {
    if (!enabled) return;
    if (!q) return;
    if (!["track", "album", "artist"].includes(type)) return;

    let cancelled = false;

    (async () => {
      try {
        setState({ loading: true, error: null, match: null });

        const res = await fetch(
          `/api/spotify/search?type=${encodeURIComponent(type)}&q=${encodeURIComponent(q)}`
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Search failed");

        if (cancelled) return;

        setState({
          loading: false,
          error: null,
          match: data?.match || null,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          loading: false,
          error: String(e?.message || e),
          match: null,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [q, type, enabled]);

  return state;
}

/** 2) iframe 렌더 전용 컴포넌트들 */
function SpotifyEmbed({ embedUrl }) {
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ borderRadius: 12, marginTop: 10 }}
      title="spotify-embed"
    />
  );
}

function YouTubeEmbed({ embedUrl }) {
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      width="30%"
      height="200"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      style={{ borderRadius: 12, marginTop: 10 }}
      title="youtube-embed"
    />
  );
}

/** 3) 최종: answer.embed 우선, 없으면 Spotify 검색 후 embed */
export default function MusicEmbed({ answer, type }) {
  // 3-1) answer.embed 우선 처리
  const embed = answer?.embed || null;

  // 3-2) embed가 없을 때만 검색하도록 q 구성
  const q = useMemo(() => {
    return [answer?.artist_name, answer?.track_name, answer?.album_name, answer?.tag]
      .filter(Boolean)
      .join(" ");
  }, [answer?.artist_name, answer?.track_name, answer?.album_name, answer?.tag]);

  const shouldSearchSpotify = !embed && Boolean(q) && ["track", "album", "artist"].includes(type);

  const { loading, error, match } = useSpotifySearch({
    q,
    type,
    enabled: shouldSearchSpotify,
  });

  // 1) embed가 있으면 즉시 렌더
  if (embed?.provider === "spotify" && embed?.id) {
    const url = `https://open.spotify.com/embed/${type}/${embed.id}`;
    return <SpotifyEmbed embedUrl={url} />;
  }

  if (embed?.provider === "youtube" && embed?.id) {
    const url = `https://www.youtube.com/embed/${embed?.id}`
    return <YouTubeEmbed embedUrl={url} />;
  }

  // 2) embed가 없으면 Spotify 검색 결과로 렌더
  if (error) return <div style={{ color: "#777", marginTop: 10 }}>Spotify 검색 실패: {error}</div>;
  if (loading) return <div style={{ color: "#777", marginTop: 10 }}>검색 중...</div>;
  if (!match?.embed_url) return <div style={{ color: "#777", marginTop: 10 }}>검색 결과가 없어요</div>;

  return <SpotifyEmbed embedUrl={match.embed_url} />;
}
