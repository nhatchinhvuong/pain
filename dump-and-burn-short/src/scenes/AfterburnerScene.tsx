import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { AiBadge, FlameTrail } from "../components/Art";
import { Captions } from "../components/Captions";
import type { Scene } from "../script";
import { colors, fontFamily } from "../theme";
import { Grid } from "./WingTankScene";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CASING =
  "M40,200 L300,215 L470,222 L700,216 L760,240 L760,360 L700,384 L470,378 L300,385 L40,400 Z";

const SectionLabel: React.FC<{ x: number; y: number; text: string; opacity: number; color?: string }> = ({
  x,
  y,
  text,
  opacity,
  color = "#fff",
}) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily={fontFamily}
    fontWeight={900}
    fontSize={32}
    stroke="#000"
    strokeWidth={6}
    paintOrder="stroke"
    opacity={opacity}
  >
    {text}
  </text>
);

export const AfterburnerScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lab = (at: number) => interpolate(frame, [at, at + 8], [0, 1], clamp);

  const abOn = interpolate(frame, [10, 40], [0, 1], clamp); // afterburner light-up
  const streamX = interpolate(frame, [1.6 * fps, 3.4 * fps], [760, 1000], clamp); // dumped fuel stream
  const ignite = 3.4 * fps;
  const fireLen = interpolate(frame, [ignite, ignite + 30], [0, 900], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const flash = interpolate(frame, [ignite - 2, ignite, ignite + 10], [0, 1, 0], clamp);
  const gaugeFill = interpolate(frame, [12, 70], [0, 1700], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const gx = (c: number) => 80 + (c / 2000) * 920;
  const shake = frame > ignite ? (random(`s${frame}`) - 0.5) * 10 : 0;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #1d1530 0%, ${colors.night} 75%)` }}>
      <Grid />
      <svg
        width={1080}
        height={760}
        viewBox="0 0 1080 760"
        style={{ position: "absolute", top: 400, translate: `${shake}px ${shake / 2}px` }}
      >
        <defs>
          <linearGradient id="combustor" x1="0" x2="1">
            <stop offset="0" stopColor="#ff9d3f" />
            <stop offset="1" stopColor="#ff4d1a" />
          </linearGradient>
          <linearGradient id="ab-core" x1="0" x2="1">
            <stop offset="0" stopColor="#ffe9a8" stopOpacity={0.9} />
            <stop offset="0.5" stopColor={colors.flame} stopOpacity={0.85} />
            <stop offset="1" stopColor="#ff3b1a" stopOpacity={0.0} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>

        {/* afterburner plume outside the nozzle */}
        <g opacity={abOn} style={{ mixBlendMode: "screen" }}>
          <polygon
            points={`760,250 ${1080},${215 + 6 * Math.sin(frame / 2)} 1080,${385 - 6 * Math.sin(frame / 2)} 760,350`}
            fill="url(#ab-core)"
            filter="url(#glow)"
          />
          {[810, 880, 950, 1020].map((x, i) => (
            <polygon
              key={x}
              points={`${x - 24},300 ${x},${282 + i * 2} ${x + 24},300 ${x},${318 - i * 2}`}
              fill="#fff6d0"
              opacity={0.75 - i * 0.15}
            />
          ))}
        </g>

        {/* engine casing */}
        <polygon points={CASING} fill="rgba(20,28,44,0.85)" stroke="#9fc4ff" strokeWidth={4} />
        {/* compressor stages */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 70 + i * 23;
          const h = 88 - i * 3.5;
          return <line key={i} x1={x} x2={x + 6} y1={300 - h} y2={300 + h} stroke="#7d93b5" strokeWidth={6} />;
        })}
        {/* combustor */}
        <rect x={310} y={240} width={92} height={120} rx={26} fill="url(#combustor)" opacity={0.6 + 0.4 * Math.abs(Math.sin(frame / 5))} />
        {/* turbine */}
        {[415, 438, 461].map((x) => (
          <line key={x} x1={x} x2={x + 8} y1={238} y2={362} stroke="#c3cee0" strokeWidth={8} />
        ))}
        {/* afterburner spray bars + flame holders */}
        <line x1={500} x2={500} y1={235} y2={365} stroke="#cfd8e6" strokeWidth={4} />
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={500} cy={248 + i * 21} r={4} fill={colors.fuel} />
        ))}
        <path d="M525,260 l18,12 l-18,12 M525,316 l18,12 l-18,12" stroke="#cfd8e6" strokeWidth={4} fill="none" />
        {/* afterburner flame inside duct */}
        <polygon
          points={`545,${262 - 10 * abOn} 760,248 760,352 545,${338 + 10 * abOn}`}
          fill="url(#ab-core)"
          opacity={abOn}
          filter="url(#glow)"
        />

        {/* fuel dump pipe (between the engines) */}
        <line x1={160} x2={760} y1={470} y2={470} stroke="#24364f" strokeWidth={18} strokeLinecap="round" />
        <line
          x1={160}
          x2={760}
          y1={470}
          y2={470}
          stroke={colors.fuel}
          strokeWidth={8}
          strokeDasharray="22 18"
          strokeDashoffset={-frame * 7}
          opacity={lab(1.2 * fps)}
        />
        {/* dumped fuel stream rising into the plume */}
        <path
          d={`M760,470 Q${(760 + streamX) / 2},468 ${streamX},${470 - ((streamX - 760) / 240) * 60}`}
          stroke={colors.fuel}
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          opacity={frame < ignite + 6 ? 0.9 : 0}
        />

        {/* ignition → torch */}
        <g transform={`translate(740,420) scale(-1,1)`}>
          <FlameTrail frame={frame} length={fireLen} width={190} seed="ab" />
        </g>
        <circle cx={980} cy={415} r={160} fill="#fff7d6" opacity={flash} filter="url(#glow)" />

        {/* labels */}
        <SectionLabel x={180} y={170} text="圧縮機" opacity={lab(4)} />
        <SectionLabel x={356} y={170} text="燃焼室" opacity={lab(8)} />
        <SectionLabel x={440} y={430} text="タービン" opacity={lab(12)} />
        <SectionLabel x={620} y={170} text="アフターバーナー" color={colors.flameHot} opacity={lab(16)} />
        <SectionLabel x={430} y={530} text="燃料放出口（2基のエンジンの間）" color={colors.fuel} opacity={lab(1.2 * fps)} />

        {/* temperature gauge */}
        <g opacity={lab(10)}>
          <rect x={80} y={630} width={920} height={30} rx={15} fill="rgba(255,255,255,0.12)" />
          <rect x={80} y={630} width={(gaugeFill / 2000) * 920} height={30} rx={15} fill={colors.flame} />
          <line x1={gx(210)} x2={gx(210)} y1={612} y2={678} stroke={colors.fuel} strokeWidth={6} />
          <text x={gx(210)} y={720} fill={colors.fuel} fontFamily={fontFamily} fontWeight={900} fontSize={30} textAnchor="start">
            燃料の自然発火 約210℃
          </text>
          <line x1={gx(1700)} x2={gx(1700)} y1={612} y2={678} stroke="#fff" strokeWidth={6} />
          <text x={gx(1700)} y={600} fill={colors.flameHot} fontFamily={fontFamily} fontWeight={900} fontSize={30} textAnchor="middle">
            排気 最大 約{Math.round(gaugeFill).toLocaleString()}℃
          </text>
        </g>
      </svg>
      <AiBadge fontFamily={fontFamily} />
      <Captions lines={scene.lines} />
    </AbsoluteFill>
  );
};
