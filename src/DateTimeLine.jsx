export default function DateTimeLine({ dates, activeIndex, onPick }) {
  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #eee",
        borderRadius: 14,
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 12 }}>날짜 선택</div>

      <div style={{ position: "relative", padding: "20px 10px 10px" }}>
        {/* 선 */}
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            top: 30,
            height: 2,
            background: "#111",
            opacity: 0.85,
          }}
        />

        {/* 점 */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          {dates.map((d, idx) => {
            const active = idx === activeIndex;

            return (
              <div key={d} style={{ textAlign: "center", minWidth: 90 }}>
                <button
                  onClick={() => onPick(idx)}
                  style={{
                    width: active ? 14 : 12,
                    height: active ? 14 : 12,
                    borderRadius: 999,
                    background: active ? "#111" : "#fff",
                    border: "2px solid #111",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title={d}
                  aria-label={`pick-${d}`}
                />
                <div style={{ marginTop: 10, fontSize: 12 }}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
