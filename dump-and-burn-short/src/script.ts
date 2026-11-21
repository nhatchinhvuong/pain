/**
 * Master script for the Short.
 * All times are in seconds, relative to the start of each scene.
 * kind "real" = slot for real footage (75%), "ai" = AI / CG cross-section (25%).
 *
 * Real footage files are picked up automatically from public/footage/<id>.mp4
 * (see FOOTAGE.md). Without a file, a stylised placeholder is rendered.
 */

export type Line = { from: number; to: number; text: string; accent?: string };

export type Scene = {
  id: string;
  kind: "real" | "ai";
  seconds: number;
  /** what the editor should put in this slot */
  footageBrief?: string;
  /** placeholder look when no footage file exists */
  placeholder?: "f111-burn" | "f111-night" | "airliner-dump" | "airliner-climb";
  lines: Line[];
};

export const scenes: Scene[] = [
  {
    id: "s1_hook",
    kind: "real",
    seconds: 4.5,
    placeholder: "f111-burn",
    footageBrief:
      "F-111 が低空パスしながら尾部から長い炎を引く Dump & Burn の決定的瞬間（引き→寄り）",
    lines: [
      { from: 0.2, to: 4.5, text: "燃料を空中で捨てて\n『火をつける』" },
    ],
  },
  {
    id: "s2_airliner",
    kind: "real",
    seconds: 5.5,
    placeholder: "airliner-dump",
    footageBrief:
      "旅客機（B747/B777 等）の翼端付近から白い燃料の霧が2本たなびく実写",
    lines: [
      { from: 0, to: 2.6, text: "実は旅客機も\n燃料を“捨てる”ことがある" },
      { from: 2.6, to: 5.5, text: "1回で最大\n約1,500万円分", accent: "約1,500万円分" },
    ],
  },
  {
    id: "s3_weight",
    kind: "real",
    seconds: 9,
    placeholder: "airliner-climb",
    footageBrief:
      "大型旅客機の離陸・上昇シーン（重さを感じるローテーション）→ 着陸接地の実写",
    lines: [
      { from: 0, to: 2.2, text: "理由は“重さ”", accent: "重さ" },
      { from: 2.2, to: 5.2, text: "離陸できる重さと\n着陸できる重さは別物" },
      { from: 5.2, to: 9, text: "満タンで引き返すと\n重すぎて降りられない", accent: "降りられない" },
    ],
  },
  {
    id: "s4_wing_ai",
    kind: "ai",
    seconds: 7,
    lines: [
      { from: 0, to: 3.4, text: "翼のタンクから\nポンプで送り出し" },
      { from: 3.4, to: 7, text: "翼端のノズルから\n毎分 約2トン放出", accent: "毎分 約2トン" },
    ],
  },
  {
    id: "s5_mist",
    kind: "real",
    seconds: 6,
    placeholder: "airliner-dump",
    footageBrief:
      "燃料投棄中の旅客機を後方/下方から（霧が広がり消えていく様子）。随伴機視点があればベスト",
    lines: [
      { from: 0, to: 3, text: "高度 約1,800m以上で撒けば\n地上に届く前に霧になって蒸発" },
      { from: 3, to: 6, text: "急病人やエンジン故障で\n実際に行われている" },
    ],
  },
  {
    id: "s6_f111",
    kind: "real",
    seconds: 6,
    placeholder: "f111-burn",
    footageBrief:
      "F-111 の後方アングル：2基のエンジンの間（尾部の放出口）から燃料が流れ出し、点火する瞬間",
    lines: [
      { from: 0, to: 2.8, text: "ところが戦闘機F-111は\nこの燃料に火をつけた", accent: "火をつけた" },
      { from: 2.8, to: 6, text: "2基のエンジンの間から\n燃料を流し…" },
    ],
  },
  {
    id: "s7_afterburner_ai",
    kind: "ai",
    seconds: 7,
    lines: [
      { from: 0, to: 3.4, text: "アフターバーナーの炎は\n最大 約1,700℃", accent: "約1,700℃" },
      { from: 3.4, to: 7, text: "燃料は約210℃で自然発火\n一瞬で巨大な炎の尾に", accent: "炎の尾" },
    ],
  },
  {
    id: "s8_night",
    kind: "real",
    seconds: 6,
    placeholder: "f111-night",
    footageBrief:
      "夜空/夕暮れの航空ショーで F-111 が巨大な炎を引いて上昇・通過（観客の歓声入り）",
    lines: [
      { from: 0, to: 2.6, text: "これが\n“ダンプ・アンド・バーン”", accent: "ダンプ・アンド・バーン" },
      { from: 2.6, to: 6, text: "戦闘では役に立たない\n航空ショー専用の“見せ技”" },
    ],
  },
  {
    id: "s9_outro",
    kind: "real",
    seconds: 5,
    placeholder: "f111-night",
    footageBrief:
      "F-111 のラストフライト/退役セレモニー、または炎のパスのスロー再生",
    lines: [
      { from: 0, to: 2.8, text: "F-111は2010年に全機退役\nもう見られない幻の炎", accent: "幻の炎" },
      { from: 2.8, to: 5, text: "“知らなかった！”人は\nコメントで教えて" },
    ],
  },
];

export const totalSeconds = scenes.reduce((a, s) => a + s.seconds, 0);
