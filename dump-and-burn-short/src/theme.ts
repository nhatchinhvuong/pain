import { loadFont } from "@remotion/google-fonts/NotoSansJP";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "900"],
  subsets: ["japanese", "latin"],
});

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const colors = {
  night: "#05070d",
  sky: "#0d1a2e",
  panel: "rgba(8, 14, 26, 0.78)",
  line: "rgba(160, 200, 255, 0.35)",
  text: "#ffffff",
  dim: "#a9b8cc",
  fuel: "#39d0ff",
  fuelDeep: "#0a7fb8",
  flame: "#ff6a1a",
  flameHot: "#ffd23f",
  danger: "#ff3b3b",
  ok: "#4ade80",
};

// Heavy outline so captions read on any footage
export const strokeText = (px = 6, color = "#000") =>
  ({
    WebkitTextStroke: `${px}px ${color}`,
    paintOrder: "stroke fill",
    textShadow: "0 6px 24px rgba(0,0,0,0.6)",
  }) as const;
