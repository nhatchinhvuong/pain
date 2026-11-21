import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  getStaticFiles,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../script";
import { colors, fontFamily } from "../theme";
import { AirlinerSilhouette, FlameTrail, JetSilhouette, MistTrail } from "./Art";

const EXTS = ["mp4", "mov", "webm"];

/** Returns the public/ path of the footage for a scene id, if the editor dropped one in. */
export const findFootage = (id: string): string | null => {
  const files = getStaticFiles();
  for (const ext of EXTS) {
    const name = `footage/${id}.${ext}`;
    if (files.some((f) => f.name === name)) return name;
  }
  return null;
};

const Sky: React.FC<{ night: boolean }> = ({ night }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: night
          ? "linear-gradient(180deg,#02030a 0%,#0b1230 55%,#3a1a2a 100%)"
          : "linear-gradient(180deg,#2c5f93 0%,#6fa3cf 55%,#c9dbe8 100%)",
      }}
    >
      <svg width={1080} height={1920}>
        {night &&
          Array.from({ length: 90 }).map((_, i) => (
            <circle
              key={i}
              cx={random(`sx${i}`) * 1080}
              cy={random(`sy${i}`) * 1100}
              r={random(`sr${i}`) * 2 + 0.5}
              fill="#fff"
              opacity={0.3 + 0.5 * Math.abs(Math.sin(frame / 20 + i))}
            />
          ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <ellipse
            key={i}
            cx={((random(`cx${i}`) * 1600 - frame * (1.5 + i * 0.4)) % 1600 + 1600) % 1600 - 260}
            cy={300 + random(`cy${i}`) * 1300}
            rx={260 + random(`crx${i}`) * 200}
            ry={50 + random(`cry${i}`) * 40}
            fill={night ? "#1b2340" : "#ffffff"}
            opacity={night ? 0.35 : 0.45}
            style={{ filter: "blur(18px)" }}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Placeholder: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const type = scene.placeholder ?? "f111-burn";
  const night = type === "f111-night";
  const shake = (k: string) => (random(`${k}-${frame}`) - 0.5) * 3;

  let content: React.ReactNode;
  if (type === "f111-burn" || type === "f111-night") {
    const x = interpolate(p, [0, 1], [night ? 520 : 760, night ? 760 : 380]);
    const y = interpolate(p, [0, 1], [night ? 760 : 700, night ? 520 : 690]);
    const len = interpolate(frame, [0, 12], [200, night ? 1100 : 900], {
      extrapolateRight: "clamp",
    });
    content = (
      <g
        transform={`translate(${x + shake("x")},${y + shake("y")}) rotate(${night ? -14 : -2}) scale(1.1)`}
      >
        <g transform="translate(18,117)">
          <FlameTrail frame={frame} length={len} width={86} seed={scene.id} />
        </g>
        <JetSilhouette />
      </g>
    );
  } else {
    const climb = type === "airliner-climb";
    const x = interpolate(p, [0, 1], [climb ? 120 : 260, climb ? 260 : 140]);
    const y = interpolate(p, [0, 1], [climb ? 820 : 700, climb ? 640 : 690]);
    content = (
      <g transform={`translate(${x},${y}) rotate(${climb ? -10 : 0}) scale(1.05)`}>
        {!climb && (
          <g transform="translate(232,178)">
            <MistTrail frame={frame} length={720} seed={scene.id} />
          </g>
        )}
        <AirlinerSilhouette />
      </g>
    );
  }

  return (
    <AbsoluteFill>
      <Sky night={night} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {content}
      </svg>
      {/* editor-facing slot label, only visible while no real footage is present */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 210,
          fontFamily,
          fontSize: 26,
          fontWeight: 500,
          color: "#fff",
          background: "rgba(0,0,0,0.55)",
          border: "2px dashed rgba(255,255,255,0.5)",
          borderRadius: 16,
          padding: "14px 20px",
          lineHeight: 1.45,
        }}
      >
        <div style={{ fontWeight: 900, color: colors.flameHot }}>
          実写素材スロット → public/footage/{scene.id}.mp4
        </div>
        {scene.footageBrief}
      </div>
    </AbsoluteFill>
  );
};

export const FootageSlot: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const src = findFootage(scene.id);
  if (!src) return <Placeholder scene={scene} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Video
        src={staticFile(src)}
        volume={0.35}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
            output: "perceptual-scale",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
