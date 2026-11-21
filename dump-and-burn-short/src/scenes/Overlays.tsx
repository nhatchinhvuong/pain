import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily, strokeText } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** S1 — the hook headline */
export const HookTitle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 112,
          lineHeight: 1.12,
          textAlign: "center",
          color: "#fff",
          ...strokeText(16),
          rotate: "-3deg",
          scale: interpolate(frame, [0, 8], [1.6, 1], {
            ...clamp,
            easing: Easing.bezier(0.2, 1.4, 0.4, 1),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 4], [0, 1], clamp),
        }}
      >
        戦闘機の
        <br />
        <span style={{ color: colors.flame }}>危険すぎる裏技</span>
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily,
          fontWeight: 700,
          fontSize: 40,
          color: colors.flameHot,
          letterSpacing: 6,
          ...strokeText(8),
          opacity: interpolate(frame, [12, 20], [0, 1], clamp),
        }}
      >
        DUMP &amp; BURN
      </div>
    </AbsoluteFill>
  );
};

/** Persistent question at the top of every scene after the hook */
export const TopicBand: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
    <div
      style={{
        fontFamily,
        fontWeight: 900,
        fontSize: 52,
        color: "#fff",
        background: "rgba(0,0,0,0.6)",
        borderLeft: `10px solid ${colors.flame}`,
        padding: "12px 34px",
        borderRadius: 10,
      }}
    >
      なぜ燃料を<span style={{ color: colors.fuel }}>捨て</span>て
      <span style={{ color: colors.flame }}>燃やす</span>？
    </div>
  </AbsoluteFill>
);

export const Footnote: React.FC<{ text: string; from?: number }> = ({ text, from = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 1490,
        textAlign: "center",
        fontFamily,
        fontWeight: 500,
        fontSize: 28,
        color: "#e6edf5",
        ...strokeText(5),
        opacity: interpolate(frame, [from * fps, from * fps + 8], [0, 1], clamp),
      }}
    >
      {text}
    </div>
  );
};

export const Chip: React.FC<{ text: string; top: number; color?: string; from?: number }> = ({
  text,
  top,
  color = colors.fuel,
  from = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        fontFamily,
        fontWeight: 900,
        fontSize: 44,
        color: "#fff",
        background: "rgba(0,0,0,0.6)",
        border: `3px solid ${color}`,
        borderRadius: 14,
        padding: "10px 26px",
        translate: interpolate(frame, [from * fps, from * fps + 10], ["-60px 0px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        opacity: interpolate(frame, [from * fps, from * fps + 10], [0, 1], clamp),
      }}
    >
      {text}
    </div>
  );
};

/** S3 — MTOW vs MLW bars over the take-off footage (Boeing 777-300ER figures) */
export const WeightBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const MAX = 351;
  const rows = [
    { label: "最大離陸重量", value: 351, color: colors.flame, at: 2.2 },
    { label: "最大着陸重量", value: 251.3, color: colors.ok, at: 3.2 },
  ];
  const barW = 800;
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 80,
        right: 80,
        background: colors.panel,
        borderRadius: 24,
        padding: "30px 36px 36px",
        fontFamily,
        color: "#fff",
        opacity: interpolate(frame, [2 * fps, 2.2 * fps + 6], [0, 1], clamp),
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 700, color: colors.dim, marginBottom: 14 }}>
        例：ボーイング777-300ER
      </div>
      {rows.map((r) => {
        const w = interpolate(frame, [r.at * fps, r.at * fps + 18], [0, (r.value / MAX) * barW], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div key={r.label} style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 900 }}>
              <span>{r.label}</span>
              <span style={{ color: r.color }}>
                {Math.round(interpolate(w, [0, (r.value / MAX) * barW], [0, r.value]))} t
              </span>
            </div>
            <div style={{ height: 34, background: "rgba(255,255,255,0.12)", borderRadius: 8, marginTop: 8 }}>
              <div style={{ width: w, height: "100%", background: r.color, borderRadius: 8 }} />
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 26,
          textAlign: "right",
          fontSize: 64,
          fontWeight: 900,
          color: colors.danger,
          ...strokeText(6),
          scale: interpolate(frame, [4.4 * fps, 4.4 * fps + 8], [2, 1], {
            ...clamp,
            easing: Easing.bezier(0.2, 1.5, 0.4, 1),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [4.4 * fps, 4.4 * fps + 4], [0, 1], clamp),
        }}
      >
        差 約100トン
      </div>
    </div>
  );
};

/** S9 — subscribe/save nudge */
export const SaveCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 3);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 560 }}>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 60,
          color: "#000",
          background: colors.flameHot,
          borderRadius: 999,
          padding: "18px 56px",
          scale: pulse,
          opacity: interpolate(frame, [2.8 * fps, 2.8 * fps + 8], [0, 1], clamp),
        }}
      >
        保存して友達に見せよう
      </div>
    </AbsoluteFill>
  );
};
