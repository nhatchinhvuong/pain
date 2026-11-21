import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  getStaticFiles,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { scenes, type Scene } from "./script";
import { AfterburnerScene } from "./scenes/AfterburnerScene";
import { Chip, Footnote, HookTitle, SaveCta, TopicBand, WeightBars } from "./scenes/Overlays";
import { RealScene } from "./scenes/RealScene";
import { WingTankScene } from "./scenes/WingTankScene";
import { colors, fontFamily } from "./theme";
import { AiBadge } from "./components/Art";
import { findFootage } from "./components/FootageSlot";

/** AI-generated clip (e.g. Google Flow / Veo) dropped into public/footage/<id>.mp4 */
const GeneratedAi: React.FC<{ scene: Scene }> = ({ scene }) => (
  <RealScene scene={scene}>
    <AiBadge fontFamily={fontFamily} />
  </RealScene>
);

const byId = (id: string) => scenes.find((s) => s.id === id) as Scene;

export const SceneView: React.FC<{ id: string }> = ({ id }) => {
  const scene = byId(id);
  switch (id) {
    case "s1_hook":
      return (
        <RealScene scene={scene}>
          <HookTitle />
        </RealScene>
      );
    case "s2_airliner":
      return (
        <RealScene scene={scene}>
          <TopicBand />
          <Footnote from={2.6} text="※B777が約100t放出、ジェット燃料 約120円/Lで試算" />
        </RealScene>
      );
    case "s3_weight":
      return (
        <RealScene scene={scene}>
          <TopicBand />
          <WeightBars />
        </RealScene>
      );
    case "s4_wing_ai":
      return findFootage(id) ? <GeneratedAi scene={scene} /> : <WingTankScene scene={scene} />;
    case "s5_mist":
      return (
        <RealScene scene={scene}>
          <TopicBand />
          <Chip top={360} text="高度 6,000ft（約1,800m）以上" from={0.2} />
          <Chip top={460} text="燃料は霧化 → 蒸発" from={1} />
          <Footnote from={3} text="※A320・737など小型機は投棄装置なし（着陸重量に余裕がある）" />
        </RealScene>
      );
    case "s6_f111":
      return (
        <RealScene scene={scene}>
          <TopicBand />
          <Chip top={360} text="General Dynamics F-111" color={colors.flame} from={0.2} />
        </RealScene>
      );
    case "s7_afterburner_ai":
      return findFootage(id) ? <GeneratedAi scene={scene} /> : <AfterburnerScene scene={scene} />;
    case "s8_night":
      return (
        <RealScene scene={scene}>
          <TopicBand />
        </RealScene>
      );
    case "s9_outro":
      return (
        <RealScene scene={scene}>
          <TopicBand />
          <SaveCta />
        </RealScene>
      );
    default:
      return null;
  }
};

/** short white/orange flash on the cut into the fire scenes */
const CutFlash: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity: interpolate(frame, [0, 6], [0.8, 0], { extrapolateRight: "clamp" }),
      }}
    />
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 10,
        width: `${(frame / durationInFrames) * 100}%`,
        background: `linear-gradient(90deg, ${colors.fuel}, ${colors.flame})`,
      }}
    />
  );
};

const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

export const DumpAndBurn: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.night }}>
      <Series>
        {scenes.map((s) => (
          <Series.Sequence key={s.id} name={`${s.id} [${s.kind}]`} durationInFrames={Math.round(s.seconds * fps)}>
            <SceneView id={s.id} />
            {(s.id === "s6_f111" || s.id === "s8_night" || s.id === "s1_hook") && (
              <CutFlash color={s.id === "s1_hook" ? "#fff" : colors.flame} />
            )}
          </Series.Sequence>
        ))}
      </Series>
      <ProgressBar />
      {hasFile("audio/voiceover.mp3") && <Audio src={staticFile("audio/voiceover.mp3")} />}
      {hasFile("audio/bgm.mp3") && <Audio src={staticFile("audio/bgm.mp3")} volume={0.15} />}
    </AbsoluteFill>
  );
};
