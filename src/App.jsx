import { useMemo, useState } from "react";
import data from "./data/answers.json";
import DateTimeLine from "./DateTimeLine.jsx";
import MusicEmbed from "./components/MusicEmbed.jsx";

function getEmbedTheme() {
  return {
    bg: "linear-gradient(120deg, rgba(154, 208, 245, 0.26), rgba(240, 169, 196, 0.18))",
    border: "#ddd",
  };
}

function AnswerCard({ type, answer }) {
  const theme = getEmbedTheme();
  
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        marginBottom: 8
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700, marginBottom: -20, textAlign: "right" }}>{answer.name}</div>

      {answer.description && <div style={{ fontSize: 18, marginBottom: 10 }}><b>🎬 {answer.description}</b></div>}
      {answer.artist_name && <div style={{ fontSize: 17, marginBottom: 6 }}><b>🎤 {answer.artist_name}</b></div>}
      {answer.track_name && <div style={{ fontSize: 16, marginBottom: 6 }}>🎵 {answer.track_name}</div>}
      {answer.album_name && <div style={{ fontSize: 16, marginBottom: 6 }}>💿 {answer.album_name}</div>}
      
      <MusicEmbed answer={answer} type={type}/>
    </div>
  );
}

function QuestionBlock({ item }) {
  return (
    <section
      style={{
        background: "rgba(255, 255, 255, 0.29)",
        border: "1px solid rgba(15, 23, 42, 0.06)",
        borderLeft: "4px solid rgba(82, 176, 238, 0.2)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        borderRadius: 16,
        padding: 16
      }}
    >
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
          background: "linear-gradient(180deg, #f7f9fc 0%, #f3f6fb 100%)",
          width: "min(1000px, 100%)",
          margin: "0 auto",
          padding: "24px 16px",
          boxSizing: "border-box"
        }}
      >
        <h1 style={{ fontSize: 45, textAlign: "center" }}>R E C O R D · Y O U R · F A V O R I T E</h1>

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
