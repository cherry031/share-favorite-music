import { useMemo, useState } from "react";
import data from "./data/answers.json";
import DateTimeLine from "./DateTimeLine.jsx";
import AutoSpotifyEmbed from "./components/MusicEmbed.jsx";

function AnswerCard({ type, answer }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{answer.name}</div>

      {answer.description && <div><b>{answer.description}</b></div>}
      {answer.artist_name && <div>🎤 {answer.artist_name}</div>}
      {answer.track_name && <div>🎵 {answer.track_name}</div>}
      {answer.album_name && <div>💿 {answer.album_name}</div>}
      <AutoSpotifyEmbed type={type} artistName={answer.artist_name} trackName={answer.track_name} albumName={answer.album_name} tag={answer.tag}/>
    </div>
  );
}

function QuestionBlock({ item }) {
  return (
    <section style={{ border: "1px solid #eee", borderRadius: 16, padding: 16 }}>
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>{item.question}</h2>

      <div style={{ display: "grid", gap: 12 }}>
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
          width: "min(800px, 100%)",
          margin: "0 auto",
          padding: "24px 16px",
          boxSizing: "border-box"
        }}
      >
        <h1 style={{ margin: 0 }}>음악 취향 기록</h1>

        <DateTimeLine
          dates={dates}
          activeIndex={activeIndex}
          onPick={setActiveIndex}
        />

        <div style={{ color: "#777" }}>
          선택된 날짜: <span style={{ color: "#111", fontWeight: 700 }}>{activeDate}</span>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {(activeDay?.questions || []).map((item, idx) => (
            <QuestionBlock key={`${item.question}-${idx}`} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
