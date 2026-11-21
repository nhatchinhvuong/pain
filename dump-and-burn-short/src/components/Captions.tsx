import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Line } from "../script";
import { colors, fontFamily, strokeText } from "../theme";

const renderText = (text: string, accent?: string) => {
  return text.split("\n").map((row, i) => {
    if (accent && row.includes(accent)) {
      const [a, b] = row.split(accent);
      return (
        <div key={i}>
          {a}
          <span style={{ color: colors.flameHot }}>{accent}</span>
          {b}
        </div>
      );
    }
    return <div key={i}>{row}</div>;
  });
};

const CaptionLine: React.FC<{ line: Line; durationInFrames: number }> = ({
  line,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 1170,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 74,
          lineHeight: 1.25,
          color: colors.text,
          textAlign: "center",
          padding: "0 70px",
          ...strokeText(14),
          scale: interpolate(frame, [0, 7], [0.82, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.6, 0.4, 1),
            output: "perceptual-scale",
          }),
          opacity: interpolate(
            frame,
            [0, 4, durationInFrames - 4, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        {renderText(line.text, line.accent)}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ lines: Line[] }> = ({ lines }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {lines.map((l, i) => {
        const from = Math.round(l.from * fps);
        const dur = Math.round(l.to * fps) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`Caption ${i + 1}`}>
            <CaptionLine line={l} durationInFrames={dur} />
          </Sequence>
        );
      })}
    </>
  );
};
