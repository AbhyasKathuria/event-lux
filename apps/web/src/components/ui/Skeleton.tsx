"use client";

export function Skeleton({ width = "100%", height = "16px", borderRadius = "8px", style = {} }: {
  width?: string; height?: string; borderRadius?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{ width, height, borderRadius, background: "var(--border)", animation: "shimmer 1.5s infinite", ...style }} />
  );
}

export function EventCardSkeleton() {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ height: "140px", background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Skeleton height="20px" width="70%" />
        <Skeleton height="14px" width="45%" />
        <Skeleton height="14px" />
        <Skeleton height="14px" width="85%" />
        <Skeleton height="40px" borderRadius="12px" style={{ marginTop: "6px" }} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "16px 20px" }}>
          <Skeleton height="14px" width={i === 0 ? "80%" : "60%"} />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <Skeleton height="28px" width="28px" borderRadius="8px" />
      <Skeleton height="32px" width="60%" />
      <Skeleton height="14px" width="80%" />
    </div>
  );
}
