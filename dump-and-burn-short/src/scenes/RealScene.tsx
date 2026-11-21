import React from "react";
import { AbsoluteFill } from "remotion";
import { Captions } from "../components/Captions";
import { FootageSlot } from "../components/FootageSlot";
import type { Scene } from "../script";

export const RealScene: React.FC<{ scene: Scene; children?: React.ReactNode }> = ({
  scene,
  children,
}) => (
  <AbsoluteFill>
    <FootageSlot scene={scene} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
      }}
    />
    {children}
    <Captions lines={scene.lines} />
  </AbsoluteFill>
);
