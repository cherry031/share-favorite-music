import { useMemo, useState } from "react";
import data from "./data/answers.json";
import DateTimeLine from "./DateTimeLine.jsx";
import AutoSpotifyEmbed from "./components/MusicEmbed.jsx";

function AnswerCard({ type, answer }) {
  return (
    <div style={{ border: "1px solid #c7dfffff", borderRadius: 12, padding: 12, marginBottom: 8 }}>
      <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>{answer.name}</div>

      {answer.description && <div style={{ fontSize: 18, marginBottom: 10 }}><b>🎬 {answer.description}</b></div>}
      {answer.artist_name && <div style={{ fontSize: 17, marginBottom: 6 }}><b>🎤 {answer.artist_name}</b></div>}
      {answer.track_name && <div style={{ fontSize: 16, marginBottom: 6 }}>🎵 {answer.track_name}</div>}
      {answer.album_name && <div style={{ fontSize: 16, marginBottom: 6 }}>💿 {answer.album_name}</div>}
      <AutoSpotifyEmbed type={type} artistName={answer.artist_name} trackName={answer.track_name} albumName={answer.album_name} tag={answer.tag}/>
    </div>
  );
}

function QuestionBlock({ item }) {
  return (
    <section style={{ border: "1px solid #a6c9f7ff", borderRadius: 16, padding: 16 }}>
      <h2 style={{ marginTop: 15, marginBottom: 18, fontSize: 30 }}>🩵 {item.question}</h2>

      <div style={{ display: "grid", gap: 12, marginBottom: 10 }}>
        {(item.answers || []).map((ans, idx) => (
          <AnswerCard key={`${ans.name}-${idx}`} type={item.type} answer={ans} />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const dates = useMemo(() => data.map((x) => x.date).slice().sort(), []);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeDate = dates[activeIndex];
  const activeDay = useMemo(
    () => data.find((x) => x.date === activeDate),
    [activeDate]
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <main
        style={{
          width: "min(1000px, 100%)",
          margin: "0 auto",
          padding: "24px 16px",
          boxSizing: "border-box"
        }}
      >
        <h1 style={{ fontSize: 45, textAlign: "center" }}>음악 결산</h1>

        <DateTimeLine
          dates={dates}
          activeIndex={activeIndex}
          onPick={setActiveIndex}
        />

        <div style={{ display: "grid", gap: 60 }}>
          {(activeDay?.questions || []).map((item, idx) => (
            <QuestionBlock key={`${item.question}-${idx}`} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
