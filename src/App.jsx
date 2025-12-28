import data from "./data/answers.json";
import AutoSpotifyEmbed from "./components/MusicEmbed";

function AnswerCard({ type, answer }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 700 }}>{answer.name}</div>

      {answer.artist_name && <div>아티스트: {answer.artist_name}</div>}
      {answer.track_name && <div>노래: {answer.track_name}</div>}
      {answer.album_name && <div>앨범: {answer.album_name}</div>}
      {<AutoSpotifyEmbed type={type} artistName={answer.artist_name} trackName={answer.track_name} albumName={answer.album_name} tag={answer.tag}/>}
    </div>
  );
}

function QuestionBlock({ item }) {
  return (
    <section style={{ padding: 16, border: "1px solid #eee", borderRadius: 16 }}>
      <h2 style={{ marginTop: 0 }}>{item.question}</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {item.answers.map((ans, idx) => (
          <AnswerCard key={`${ans.name}-${idx}`} type={item.type} answer={ans} />
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
