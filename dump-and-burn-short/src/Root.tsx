import React from "react";
import { Composition, Folder } from "remotion";
import { DumpAndBurn, SceneView } from "./DumpAndBurn";
import { scenes, totalSeconds } from "./script";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DumpAndBurn"
        component={DumpAndBurn}
        durationInFrames={Math.round(totalSeconds * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Folder name="Scenes">
        {scenes.map((s) => (
          <Composition
            key={s.id}
            id={s.id.replace(/_/g, "-")}
            component={SceneView}
            defaultProps={{ id: s.id }}
            durationInFrames={Math.round(s.seconds * FPS)}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
      </Folder>
    </>
  );
};
