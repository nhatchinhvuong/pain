import React from "react";
import { random } from "remotion";
import { colors } from "../theme";

/** Generic swept-wing twin-engine jet, side view, nose to the right. Box 600x200. Exhaust ≈ (18,117). */
export const JetSilhouette: React.FC<{ fill?: string }> = ({ fill = "#141a24" }) => (
  <g fill={fill}>
    <path d="M40,122 L0,142 L34,144 L96,126 Z" />
    <path d="M44,108 L14,28 L56,28 L118,104 Z" />
    <path d="M18,108 L420,98 Q530,98 596,112 Q530,124 420,124 L18,128 Z" />
    <path d="M262,116 L140,156 L206,156 L338,119 Z" />
    <path d="M440,99 Q474,80 520,101 Z" fill="#2a3a52" />
  </g>
);

/** Generic wide-body airliner, side view, nose right. Box 800x240. Wing trailing tip ≈ (232,178). */
export const AirlinerSilhouette: React.FC<{ fill?: string }> = ({ fill = "#dfe6ef" }) => (
  <g>
    <path d="M70,102 L28,18 L86,18 L176,102 Z" fill={fill} />
    <path d="M60,128 L14,150 L54,152 L120,132 Z" fill="#c4cdd8" />
    <path
      d="M40,122 Q40,100 90,98 L640,98 Q724,98 776,122 Q724,144 640,144 L90,144 Q40,142 40,122 Z"
      fill={fill}
    />
    <path d="M336,132 L226,180 L292,182 L440,134 Z" fill="#b9c3cf" />
    <rect x={300} y={140} width={96} height={28} rx={14} fill="#9aa6b4" />
    {Array.from({ length: 22 }).map((_, i) => (
      <circle key={i} cx={180 + i * 20} cy={112} r={3.4} fill="#48607c" />
    ))}
    <path d="M700,104 Q730,104 748,114 L712,114 Z" fill="#48607c" />
  </g>
);

/** Flickering afterburner/fuel torch extending to the LEFT from (0,0). */
export const FlameTrail: React.FC<{
  frame: number;
  length: number;
  width: number;
  seed?: string;
}> = ({ frame, length, width, seed = "f" }) => {
  const id = `flame-${seed}`;
  const pts: string[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w =
      width * (0.25 + 0.9 * Math.sin(Math.min(1, t * 1.4) * Math.PI * 0.55)) *
      (0.85 + 0.3 * random(`${seed}-${i}-${Math.floor(frame / 2)}`));
    pts.push(`${-t * length},${-w / 2}`);
  }
  const bottom: string[] = [];
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const w =
      width * (0.25 + 0.9 * Math.sin(Math.min(1, t * 1.4) * Math.PI * 0.55)) *
      (0.85 + 0.3 * random(`${seed}-b-${i}-${Math.floor(frame / 2)}`));
    bottom.push(`${-t * length},${w / 2}`);
  }
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.08" stopColor={colors.flameHot} />
          <stop offset="0.35" stopColor={colors.flame} />
          <stop offset="0.75" stopColor="#c0260a" stopOpacity={0.7} />
          <stop offset="1" stopColor="#5a0d00" stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}-blur`}>
          <feGaussianBlur stdDeviation={width * 0.12} />
        </filter>
      </defs>
      <polygon
        points={[...pts, ...bottom].join(" ")}
        fill={`url(#${id})`}
        filter={`url(#${id}-blur)`}
      />
      <polygon points={[...pts, ...bottom].join(" ")} fill={`url(#${id})`} opacity={0.8} />
    </g>
  );
};

/** Fuel mist stream drifting to the LEFT from (0,0). */
export const MistTrail: React.FC<{ frame: number; length: number; seed: string; color?: string }> = ({
  frame,
  length,
  seed,
  color = "#ffffff",
}) => {
  const n = 46;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const life = 40;
        const phase = (frame + i * (life / n) * 1.0) % life;
        const t = phase / life;
        const x = -t * length;
        const y = (random(`${seed}-y-${i}`) - 0.3) * 30 * t + t * t * 60;
        const r = 6 + t * 46 * (0.6 + random(`${seed}-r-${i}`) * 0.6);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={color}
            opacity={(1 - t) * 0.35}
          />
        );
      })}
    </g>
  );
};

/** Badge that marks a CG / AI reconstruction. */
export const AiBadge: React.FC<{ label?: string; fontFamily: string }> = ({
  label = "AI再現イメージ",
  fontFamily,
}) => (
  <div
    style={{
      position: "absolute",
      top: 330,
      right: 70,
      fontFamily,
      fontWeight: 700,
      fontSize: 30,
      color: colors.fuel,
      border: `2px solid ${colors.fuel}`,
      borderRadius: 999,
      padding: "6px 22px",
      background: "rgba(0,0,0,0.45)",
      letterSpacing: 2,
    }}
  >
    {label}
  </div>
);
