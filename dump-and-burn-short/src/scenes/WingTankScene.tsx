import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { AiBadge } from "../components/Art";
import { Captions } from "../components/Captions";
import type { Scene } from "../script";
import { colors, fontFamily } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// top-down left wing, nose pointing up
const WING = "130,170 960,470 1010,540 130,560";
const MAIN_TANK = "160,200 740,405 740,505 160,520";
const SURGE_TANK = "800,435 900,470 900,510 800,512";
const PIPE = "M300,470 L300,505 L900,522 L944,566";
const NOZZLE = { x: 948, y: 570 };

export const Grid: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    {Array.from({ length: 28 }).map((_, i) => (
      <line key={`h${i}`} x1={0} x2={1080} y1={i * 72} y2={i * 72} stroke="rgba(80,140,220,0.10)" />
    ))}
    {Array.from({ length: 16 }).map((_, i) => (
      <line key={`v${i}`} y1={0} y2={1920} x1={i * 72} x2={i * 72} stroke="rgba(80,140,220,0.10)" />
    ))}
  </svg>
);

const Label: React.FC<{ x: number; y: number; text: string; color?: string; opacity: number; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  color = "#fff",
  opacity,
  anchor = "start",
}) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontFamily={fontFamily}
    fontWeight={900}
    fontSize={34}
    textAnchor={anchor}
    opacity={opacity}
    stroke="#000"
    strokeWidth={6}
    paintOrder="stroke"
  >
    {text}
  </text>
);

export const WingTankScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 24], [2600, 0], { ...clamp, easing: Easing.bezier(0.6, 0, 0.3, 1) });
  const drain = interpolate(frame, [40, 205], [740, 360], clamp);
  const weight = interpolate(frame, [40, 205], [351, 251], clamp);
  const flowOn = interpolate(frame, [30, 40], [0, 1], clamp);
  const sprayOn = frame > 50;
  const lab = (at: number) => interpolate(frame, [at, at + 8], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #0f2140 0%, ${colors.night} 75%)` }}>
      <Grid />
      <svg width={1080} height={760} viewBox="0 0 1080 760" style={{ position: "absolute", top: 400 }}>
        <defs>
          <clipPath id="fuel-level">
            <rect x={0} y={0} width={drain} height={760} />
          </clipPath>
          <linearGradient id="fuel-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={colors.fuel} stopOpacity={0.85} />
            <stop offset="1" stopColor={colors.fuelDeep} stopOpacity={0.9} />
          </linearGradient>
        </defs>

        {/* fuselage */}
        <rect x={40} y={0} width={90} height={760} rx={30} fill="#1a2436" stroke={colors.line} strokeWidth={3} />
        <text x={85} y={60} fill={colors.dim} fontFamily={fontFamily} fontSize={26} textAnchor="middle">
          ▲機首
        </text>

        {/* wing outline */}
        <polygon points={WING} fill="rgba(30,50,80,0.55)" stroke="#9fc4ff" strokeWidth={4} strokeDasharray={2600} strokeDashoffset={draw} />

        {/* tanks */}
        <polygon points={MAIN_TANK} fill="none" stroke={colors.fuel} strokeWidth={2} strokeDasharray="10 8" opacity={lab(14)} />
        <polygon points={MAIN_TANK} fill="url(#fuel-grad)" clipPath="url(#fuel-level)" opacity={lab(14)} />
        <polygon points={SURGE_TANK} fill="rgba(57,208,255,0.15)" stroke={colors.fuel} strokeWidth={2} opacity={lab(14)} />

        {/* sloshing surface line */}
        <line
          x1={drain}
          x2={drain}
          y1={200}
          y2={520}
          stroke="#bff1ff"
          strokeWidth={4}
          opacity={lab(40) * (0.6 + 0.4 * Math.sin(frame / 3))}
        />

        {/* jettison pipe with moving dashes */}
        <path d={PIPE} fill="none" stroke="#24364f" strokeWidth={16} strokeLinecap="round" />
        <path
          d={PIPE}
          fill="none"
          stroke={colors.fuel}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="22 18"
          strokeDashoffset={-frame * 6}
          opacity={flowOn}
        />

        {/* pump */}
        <g transform="translate(300,470)" opacity={lab(20)}>
          <circle r={34} fill="#0b1626" stroke="#fff" strokeWidth={4} />
          <g transform={`rotate(${frame * 18})`}>
            {[0, 90, 180, 270].map((a) => (
              <rect key={a} x={-4} y={-28} width={8} height={26} fill={colors.fuel} transform={`rotate(${a})`} />
            ))}
          </g>
        </g>

        {/* nozzle + spray (spray streams aft = downward) */}
        <circle cx={NOZZLE.x} cy={NOZZLE.y} r={10} fill="#fff" opacity={lab(24)} />
        {sprayOn &&
          Array.from({ length: 60 }).map((_, i) => {
            const life = 26;
            const ph = (frame - 50 + i * (life / 60)) % life;
            const t = ph / life;
            const spread = (random(`sp${i}`) - 0.5) * 160 * t;
            const r = 3 + t * 22;
            return (
              <circle
                key={i}
                cx={NOZZLE.x + spread - t * 20}
                cy={NOZZLE.y + t * 190}
                r={r}
                fill="#dff7ff"
                opacity={(1 - t) * 0.55}
              />
            );
          })}

        {/* labels */}
        <Label x={200} y={300} text="主翼燃料タンク" opacity={lab(18)} />
        <Label x={300} y={600} text="投棄ポンプ" anchor="middle" opacity={lab(26)} />
        <line x1={700} y1={690} x2={930} y2={590} stroke="#fff" strokeWidth={3} opacity={lab(54)} />
        <Label x={690} y={710} text="投棄ノズル（翼端付近）" anchor="end" color={colors.flameHot} opacity={lab(54)} />

        {/* weight readout */}
        <g transform="translate(560,40)" opacity={lab(36)}>
          <rect width={460} height={190} rx={18} fill={colors.panel} stroke={colors.line} strokeWidth={2} />
          <text x={26} y={52} fill={colors.dim} fontFamily={fontFamily} fontSize={28} fontWeight={700}>
            機体重量（早送り）
          </text>
          <text
            x={26}
            y={140}
            fill={weight <= 252 ? colors.ok : "#fff"}
            fontFamily={fontFamily}
            fontSize={88}
            fontWeight={900}
          >
            {Math.round(weight)}
            <tspan fontSize={48}> t</tspan>
          </text>
          <text x={434} y={174} fill={colors.ok} fontFamily={fontFamily} fontSize={26} fontWeight={700} textAnchor="end">
            {weight <= 252 ? "着陸OK！" : "目標 251t"}
          </text>
        </g>
      </svg>
      <AiBadge fontFamily={fontFamily} />
      <Captions lines={scene.lines} />
    </AbsoluteFill>
  );
};
