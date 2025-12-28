import data from "./data/answers.json";

function AnswerCard({ answer }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 700 }}>{answer.name}</div>

      {answer.artist_name && <div>아티스트: {answer.artist_name}</div>}
      {answer.music_name && <div>노래: {answer.music_name}</div>}
      {answer.album_name && <div>앨범: {answer.album_name}</div>}
      {answer.embed_url && <MediaEmbed url={answer.embed_url} />}
    </div>
  );
}

function QuestionBlock({ item }) {
  return (
    <section style={{ padding: 16, border: "1px solid #eee", borderRadius: 16 }}>
      <h2 style={{ marginTop: 0 }}>{item.question}</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {item.answers.map((ans, idx) => (
          <AnswerCard key={`${ans.name}-${idx}`} answer={ans} />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 20, display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>취향 기록</h1>
      {data.map((item, idx) => (
        <QuestionBlock key={idx} item={item} />
      ))}
    </main>
  );
}

function MediaEmbed({ url }) {
  if (!url) return null;

  // 간단한 안전장치: embed 도메인만 허용(원하면 확장 가능)
  const allowed = [
    "https://open.spotify.com/embed/",
    "https://www.youtube.com/embed/",
  ];

  const SPOTIFY_PREFIX = "https://open.spotify.com/embed/";
  const embedUrl = SPOTIFY_PREFIX + url;

  const ok = allowed.some((p) => embedUrl.startsWith(p));
  if (!ok) return <div style={{ color: "#777" }}>임베드 URL 형식이 아닙니다.</div>;

  // const isSpotify = url.startsWith("https://open.spotify.com/embed/");
  // const height = isSpotify ? 152 : 315;
  const height = 152

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height={height}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ borderRadius: 12, marginTop: 10 }}
      title="music-embed"
    />
    // <iframe
    //   data-testid="embed-iframe"
    //   style="border-radius:12px"
    //   src="https://open.spotify.com/embed/album/0xrAlQfw3MZ5QGhw2NptQt?utm_source=generator"
    //   width="100%"
    //   height="352"
    //   frameBorder="0"
    //   allowfullscreen=""
    //   allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    //   loading="lazy">
    // </iframe>
  );
}

