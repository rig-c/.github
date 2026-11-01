import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const BRAND_DIR = dirname(fileURLToPath(import.meta.url));
const MODULES_PATH = join(BRAND_DIR, "modules.json");
const OUT_DIR = join(BRAND_DIR, "out");

interface ModuleEntry {
  name: string;
  wordmark: string;
  tagline: string;
  chips: string[];
  alt: string;
}

function ensureDepsDir(): string {
  const localNm = join(BRAND_DIR, "node_modules", "@fontsource", "inter");
  if (existsSync(localNm)) {
    return join(BRAND_DIR, "node_modules");
  }
  const cacheBase = process.env.TMPDIR || tmpdir();
  const cacheTestDir = join(cacheBase, "font-test", "node_modules", "@fontsource", "inter");
  if (existsSync(cacheTestDir)) {
    return join(cacheBase, "font-test", "node_modules");
  }
  const workCache = join(cacheBase, "rig-c-brand-deps");
  const workNm = join(workCache, "node_modules");
  if (!existsSync(join(workNm, "@fontsource", "inter"))) {
    mkdirSync(workCache, { recursive: true });
    copyFileSync(join(BRAND_DIR, "package.json"), join(workCache, "package.json"));
    if (existsSync(join(BRAND_DIR, "bun.lock"))) {
      copyFileSync(join(BRAND_DIR, "bun.lock"), join(workCache, "bun.lock"));
    }
    const res = spawnSync("bun", ["install", "--frozen-lockfile"], {
      cwd: workCache,
      stdio: "inherit",
    });
    if (res.status !== 0) {
      throw new Error("Failed to install pinned font dependencies in cache directory");
    }
  }
  return workNm;
}

const nmDir = ensureDepsDir();
const opentypeModule = await import(resolve(nmDir, "opentype.js/dist/opentype.module.js"));
const opentype = opentypeModule.default || opentypeModule;

// Pinned OFL Font: @fontsource/inter@5.2.5 (SIL Open Font License 1.1)
const FONT_800 = opentype.loadSync(
  join(nmDir, "@fontsource/inter/files/inter-latin-800-normal.woff")
);
const FONT_600 = opentype.loadSync(
  join(nmDir, "@fontsource/inter/files/inter-latin-600-normal.woff")
);
const FONT_500 = opentype.loadSync(
  join(nmDir, "@fontsource/inter/files/inter-latin-500-normal.woff")
);

/**
 * Shared rig-c Brand Definition:
 * Canonical 5-joint colour order (Red -> Orange -> Green -> Blue -> Violet)
 * and 4 connecting bone segment gradients.
 */
export const SHARED_BRAND = {
  colors: {
    j1Red: "#FF2D55",
    j2Orange: "#FF9500",
    j3Green: "#30D158",
    j4Blue: "#0A84FF",
    j5Violet: "#BF5AF2",
    auxBone: "#242C3D",
    cardBorderLogo: "#1E2638",
    cardBorderBanner: "#1E293B",
    chipBg: "#131826",
    chipStroke: "#243046",
    taglineFill: "#94A3B8",
    slashFill: "#64748B",
  },
  chipAccents: ["#FF9500", "#30D158", "#0A84FF"] as const,
} as const;

type JointIndex = 1 | 2 | 3 | 4 | 5;
type BoneSegmentIndex = 1 | 2 | 3 | 4;

const JOINT_COLOR_BY_INDEX: Record<JointIndex, string> = {
  1: SHARED_BRAND.colors.j1Red,
  2: SHARED_BRAND.colors.j2Orange,
  3: SHARED_BRAND.colors.j3Green,
  4: SHARED_BRAND.colors.j4Blue,
  5: SHARED_BRAND.colors.j5Violet,
};

function renderSharedDefs(kind: "logo" | "banner"): string {
  const cardGrad =
    kind === "logo"
      ? `    <radialGradient id="bg-glow" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#141826" stop-opacity="0.96"/>
      <stop offset="55%" stop-color="#080a12" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#040508" stop-opacity="1"/>
    </radialGradient>`
      : `    <linearGradient id="banner-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0f1b"/>
      <stop offset="50%" stop-color="#070912"/>
      <stop offset="100%" stop-color="#040508"/>
    </linearGradient>
    <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="wordmark-accent" x1="0%" y1="0%" x2="100%" y2="15%">
      <stop offset="0%" stop-color="#FF2D55"/>
      <stop offset="28%" stop-color="#FF9500"/>
      <stop offset="55%" stop-color="#30D158"/>
      <stop offset="80%" stop-color="#0A84FF"/>
      <stop offset="100%" stop-color="#BF5AF2"/>
    </linearGradient>`;

  return `  <defs>
${cardGrad}
    <linearGradient id="seg-1-grad" gradientUnits="userSpaceOnUse" x1="360" y1="110" x2="140" y2="200">
      <stop offset="0%" stop-color="${SHARED_BRAND.colors.j1Red}"/>
      <stop offset="100%" stop-color="${SHARED_BRAND.colors.j2Orange}"/>
    </linearGradient>
    <linearGradient id="seg-2-grad" gradientUnits="userSpaceOnUse" x1="200" y1="120" x2="256" y2="280">
      <stop offset="0%" stop-color="${SHARED_BRAND.colors.j2Orange}"/>
      <stop offset="45%" stop-color="#FFCC00"/>
      <stop offset="100%" stop-color="${SHARED_BRAND.colors.j3Green}"/>
    </linearGradient>
    <linearGradient id="seg-3-grad" gradientUnits="userSpaceOnUse" x1="220" y1="240" x2="340" y2="380">
      <stop offset="0%" stop-color="${SHARED_BRAND.colors.j3Green}"/>
      <stop offset="50%" stop-color="#00C7BE"/>
      <stop offset="100%" stop-color="${SHARED_BRAND.colors.j4Blue}"/>
    </linearGradient>
    <linearGradient id="seg-4-grad" gradientUnits="userSpaceOnUse" x1="200" y1="360" x2="400" y2="380">
      <stop offset="0%" stop-color="${SHARED_BRAND.colors.j4Blue}"/>
      <stop offset="50%" stop-color="#5E5CE6"/>
      <stop offset="100%" stop-color="${SHARED_BRAND.colors.j5Violet}"/>
    </linearGradient>
    <linearGradient id="joint-void" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070d"/>
      <stop offset="100%" stop-color="#121624"/>
    </linearGradient>
    <filter id="chain-depth" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-2" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>`;
}

function renderBone(d: string, seg: BoneSegmentIndex, width = 46, dash?: string): string {
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : "";
  return `      <path d="${d}" fill="none" stroke="url(#seg-${seg}-grad)" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dashAttr} />`;
}

function renderAuxBone(d: string, width = 28, dash?: string): string {
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : "";
  return `      <path d="${d}" fill="none" stroke="${SHARED_BRAND.colors.auxBone}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dashAttr} />`;
}

function renderJoint(cx: number, cy: number, index: JointIndex): string {
  const fill = JOINT_COLOR_BY_INDEX[index];
  if (index === 3) {
    // Apex joint (J3 Green) with center pin
    return [
      `      <circle cx="${cx}" cy="${cy}" r="52" fill="${fill}" />`,
      `      <circle cx="${cx}" cy="${cy}" r="21" fill="url(#joint-void)" stroke="#090b12" stroke-width="2.5" />`,
      `      <circle cx="${cx}" cy="${cy}" r="7.5" fill="${fill}" />`,
    ].join("\n");
  }
  const outerR = index === 1 || index === 5 ? 38 : 40;
  const innerR = index === 1 || index === 5 ? 15 : 16;
  return [
    `      <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="${fill}" />`,
    `      <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="url(#joint-void)" stroke="#090b12" stroke-width="2" />`,
  ].join("\n");
}

/**
 * Builds the 512x512 inner mark group for each module using the shared
 * 5 joints (Red, Orange, Green, Blue, Violet) and 4 bone gradients.
 */
function renderModuleMark(moduleName: string): string {
  const bones: string[] = [];
  const joints: string[] = [];

  switch (moduleName) {
    case "parts": {
      // Exploded figure coming apart into 5 separated anatomical parts around the central torso joint
      bones.push(renderAuxBone("M 184 184 L 328 184 L 328 328 L 184 328 Z", 20, "14 18"));
      bones.push(renderBone("M 256 88 L 256 164", 1, 46));
      bones.push(renderBone("M 88 236 L 168 236", 2, 46));
      bones.push(renderBone("M 344 236 L 424 236", 3, 46));
      bones.push(renderBone("M 192 356 L 256 420 L 320 356", 4, 44));
      joints.push(renderJoint(256, 88, 1));
      joints.push(renderJoint(88, 236, 2));
      joints.push(renderJoint(256, 256, 3));
      joints.push(renderJoint(424, 236, 4));
      joints.push(renderJoint(256, 420, 5));
      break;
    }

    case "review": {
      // Articulated inspection eye: upper/lower lid bone arcs + central iris apex joint
      bones.push(renderAuxBone("M 256 172 A 84 84 0 1 0 256 340 A 84 84 0 1 0 256 172", 20));
      bones.push(renderBone("M 96 256 Q 168 132 256 132", 1, 44));
      bones.push(renderBone("M 256 132 Q 344 132 416 256", 2, 44));
      bones.push(renderBone("M 96 256 Q 168 380 256 380", 3, 44));
      bones.push(renderBone("M 256 380 Q 344 380 416 256", 4, 44));
      joints.push(renderJoint(96, 256, 1));
      joints.push(renderJoint(256, 132, 2));
      joints.push(renderJoint(256, 256, 3));
      joints.push(renderJoint(256, 380, 4));
      joints.push(renderJoint(416, 256, 5));
      break;
    }

    case "pose": {
      // Jointed figure mid-gesture (striding & waving)
      bones.push(renderAuxBone("M 232 204 L 116 244", 36));
      bones.push(renderAuxBone("M 224 316 L 128 412", 36));
      bones.push(renderBone("M 240 96 L 232 204", 1, 44));
      bones.push(renderBone("M 232 204 L 336 184 L 392 112", 2, 44));
      bones.push(renderBone("M 232 204 L 224 316", 3, 46));
      bones.push(renderBone("M 224 316 L 324 348 L 368 416", 4, 44));
      joints.push(renderJoint(240, 96, 1));
      joints.push(renderJoint(232, 204, 2));
      joints.push(renderJoint(392, 112, 3));
      joints.push(renderJoint(224, 316, 4));
      joints.push(renderJoint(368, 416, 5));
      break;
    }

    case "adapters": {
      // 1-to-3 branching host engine hub
      bones.push(renderBone("M 104 256 L 228 256", 1, 48));
      bones.push(renderBone("M 228 256 C 288 256 304 120 388 120", 2, 44));
      bones.push(renderBone("M 228 256 L 404 256", 3, 44));
      bones.push(renderBone("M 228 256 C 288 256 304 392 388 392", 4, 44));
      joints.push(renderJoint(104, 256, 1));
      joints.push(renderJoint(388, 120, 2));
      joints.push(renderJoint(228, 256, 3));
      joints.push(renderJoint(404, 256, 4));
      joints.push(renderJoint(388, 392, 5));
      break;
    }

    case "phaser": {
      // Swept WebGL2 Mesh2D delta chevron with internal mesh struts
      bones.push(renderAuxBone("M 108 112 L 216 336 M 108 400 L 216 176 M 216 176 L 216 336", 26));
      bones.push(renderBone("M 108 112 L 216 176", 1, 46));
      bones.push(renderBone("M 216 176 L 404 256", 2, 46));
      bones.push(renderBone("M 404 256 L 216 336", 3, 46));
      bones.push(renderBone("M 216 336 L 108 400", 4, 46));
      joints.push(renderJoint(108, 112, 1));
      joints.push(renderJoint(216, 176, 2));
      joints.push(renderJoint(404, 256, 3));
      joints.push(renderJoint(216, 336, 4));
      joints.push(renderJoint(108, 400, 5));
      break;
    }

    case "pixi": {
      // 2D Container diamond quad mesh with indexed triangle split
      bones.push(renderAuxBone("M 256 96 L 408 256 M 104 256 L 256 416 M 256 96 L 256 416", 28));
      bones.push(renderBone("M 256 96 L 104 256", 1, 44));
      bones.push(renderBone("M 104 256 L 256 256", 2, 44));
      bones.push(renderBone("M 256 256 L 408 256", 3, 44));
      bones.push(renderBone("M 408 256 L 256 416", 4, 44));
      joints.push(renderJoint(256, 96, 1));
      joints.push(renderJoint(104, 256, 2));
      joints.push(renderJoint(256, 256, 3));
      joints.push(renderJoint(408, 256, 4));
      joints.push(renderJoint(256, 416, 5));
      break;
    }

    case "three": {
      // Native Three.js 3D Group: isometric cube + Y-up/X/Z tripod at origin
      bones.push(renderAuxBone("M 256 96 L 394 176 L 394 336 L 256 416 L 118 336 L 118 176", 26));
      bones.push(renderBone("M 118 176 L 256 96", 1, 44));
      bones.push(renderBone("M 256 96 L 256 256", 2, 46));
      bones.push(renderBone("M 256 256 L 118 336", 3, 46));
      bones.push(renderBone("M 256 256 L 394 336", 4, 46));
      joints.push(renderJoint(118, 176, 1));
      joints.push(renderJoint(256, 96, 2));
      joints.push(renderJoint(256, 256, 3));
      joints.push(renderJoint(118, 336, 4));
      joints.push(renderJoint(394, 336, 5));
      break;
    }

    case "examples": {
      // 2x2 corpus & sample contact-sheet showcase radiating from central corpus pin
      bones.push(renderAuxBone("M 128 128 L 384 128 L 384 384 L 128 384 Z", 26));
      bones.push(renderBone("M 128 128 L 256 256", 1, 44));
      bones.push(renderBone("M 384 128 L 256 256", 2, 44));
      bones.push(renderBone("M 256 256 L 128 384", 3, 44));
      bones.push(renderBone("M 256 256 L 384 384", 4, 44));
      joints.push(renderJoint(128, 128, 1));
      joints.push(renderJoint(384, 128, 2));
      joints.push(renderJoint(256, 256, 3));
      joints.push(renderJoint(128, 384, 4));
      joints.push(renderJoint(384, 384, 5));
      break;
    }

    case "getting-started": {
      // 3-step ascending walkthrough staircase from bottom-left to top-right
      bones.push(renderAuxBone("M 104 392 L 396 392", 22, "16 20"));
      bones.push(renderBone("M 104 392 L 104 264", 1, 46));
      bones.push(renderBone("M 104 264 L 248 264", 2, 46));
      bones.push(renderBone("M 248 264 L 248 136", 3, 46));
      bones.push(renderBone("M 248 136 L 396 136", 4, 46));
      joints.push(renderJoint(104, 392, 1));
      joints.push(renderJoint(104, 264, 2));
      joints.push(renderJoint(248, 264, 3));
      joints.push(renderJoint(248, 136, 4));
      joints.push(renderJoint(396, 136, 5));
      break;
    }

    case "exam": {
      // Open-book exam: top rubric bar + gated pass checkmark (✓)
      bones.push(renderAuxBone("M 108 128 L 108 276", 22, "14 18"));
      bones.push(renderBone("M 108 128 L 244 128", 1, 44));
      bones.push(renderBone("M 108 276 L 212 388", 2, 48));
      bones.push(renderBone("M 212 388 L 310 252", 3, 48));
      bones.push(renderBone("M 310 252 L 408 116", 4, 48));
      joints.push(renderJoint(108, 128, 1));
      joints.push(renderJoint(108, 276, 2));
      joints.push(renderJoint(212, 388, 3));
      joints.push(renderJoint(310, 252, 4));
      joints.push(renderJoint(408, 116, 5));
      break;
    }

    case "trailer": {
      // Reproducible swing pendulum and loop arc
      bones.push(renderAuxBone("M 160 272 L 352 272", 30));
      bones.push(renderAuxBone("M 96 384 A 240 240 0 0 0 416 384", 24, "20 18"));
      bones.push(renderBone("M 96 384 A 210 210 0 0 1 160 272", 1, 44));
      bones.push(renderBone("M 160 272 L 256 104", 2, 44));
      bones.push(renderBone("M 256 104 L 352 272", 3, 44));
      bones.push(renderBone("M 352 272 A 210 210 0 0 1 416 384", 4, 44));
      joints.push(renderJoint(96, 384, 1));
      joints.push(renderJoint(160, 272, 2));
      joints.push(renderJoint(256, 104, 3));
      joints.push(renderJoint(352, 272, 4));
      joints.push(renderJoint(416, 384, 5));
      break;
    }

    case "play": {
      // Candidate mark: jointed figure framed by DOM < > brackets in the canonical 5-joint palette
      bones.push(renderAuxBone("M 184 160 L 256 256 L 328 160", 28));
      bones.push(renderBone("M 256 100 L 256 256", 1, 46));
      bones.push(renderBone("M 184 160 L 100 256 L 184 352", 2, 44));
      bones.push(renderBone("M 328 160 L 412 256 L 328 352", 3, 44));
      bones.push(renderBone("M 256 256 L 256 412", 4, 46));
      joints.push(renderJoint(256, 100, 1));
      joints.push(renderJoint(100, 256, 2));
      joints.push(renderJoint(256, 256, 3));
      joints.push(renderJoint(412, 256, 4));
      joints.push(renderJoint(256, 412, 5));
      break;
    }

    default:
      throw new Error(`Unknown module mark: ${moduleName}`);
  }

  return [
    `    <g filter="url(#chain-depth)">`,
    ...bones,
    ...joints,
    `    </g>`,
  ].join("\n");
}

function textToPathD(
  font: any,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  letterSpacing = 0
): { d: string; advance: number } {
  const path = font.getPath(text, x, y, fontSize, { letterSpacing });
  const advance = font.getAdvanceWidth(text, fontSize, { letterSpacing });
  return { d: path.toPathData(2), advance };
}

function renderWordmarkPaths(wordmark: string, x: number, y: number): string {
  // wordmark follows "@rig-c/<module>"
  const slashIdx = wordmark.indexOf("/");
  if (slashIdx === -1) {
    const full = textToPathD(FONT_800, wordmark, x, y, 46, -0.025);
    return `    <path d="${full.d}" fill="url(#text-grad)" />`;
  }
  const scopePart = wordmark.slice(0, slashIdx); // "@rig-c"
  const slashPart = "/";
  const namePart = wordmark.slice(slashIdx + 1); // "<module>"

  const fontSize = 46;
  const tracking = -0.025;

  const pScope = textToPathD(FONT_800, scopePart, x, y, fontSize, tracking);
  const xSlash = x + pScope.advance + 1;
  const pSlash = textToPathD(FONT_800, slashPart, xSlash, y, fontSize, tracking);
  const xName = xSlash + pSlash.advance + 1;
  const pName = textToPathD(FONT_800, namePart, xName, y, fontSize, tracking);

  return [
    `    <path d="${pScope.d}" fill="url(#text-grad)" />`,
    `    <path d="${pSlash.d}" fill="${SHARED_BRAND.colors.slashFill}" />`,
    `    <path d="${pName.d}" fill="url(#wordmark-accent)" />`,
  ].join("\n");
}

function renderLogoSvg(entry: ModuleEntry): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" role="img" aria-label="${escapeXml(entry.alt)}">
${renderSharedDefs("logo")}
  <rect x="2" y="2" width="508" height="508" rx="110" fill="url(#bg-glow)" stroke="${SHARED_BRAND.colors.cardBorderLogo}" stroke-width="2" />
  <g id="mark-${entry.name}">
${renderModuleMark(entry.name)}
  </g>
</svg>
`;
}

function renderBannerSvg(entry: ModuleEntry): string {
  const wordmarkSvg = renderWordmarkPaths(entry.wordmark, 0, 102);
  const taglinePath = textToPathD(FONT_500, entry.tagline, 2, 144, 15.5, -0.008);

  const chipItems: string[] = [];
  let chipX = 2;
  const chipY = 168;
  const chipH = 26;

  entry.chips.slice(0, 3).forEach((chipLabel, idx) => {
    const accent = SHARED_BRAND.chipAccents[idx % SHARED_BRAND.chipAccents.length];
    const labelX = chipX + 22;
    const labelY = chipY + 17;
    const chipText = textToPathD(FONT_600, chipLabel, labelX, labelY, 11, 0.02);
    const chipW = Math.ceil(22 + chipText.advance + 12);

    chipItems.push(
      `      <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="6" fill="${SHARED_BRAND.colors.chipBg}" stroke="${SHARED_BRAND.colors.chipStroke}" stroke-width="1" />`,
      `      <circle cx="${chipX + 11}" cy="${chipY + 13}" r="3.2" fill="${accent}" />`,
      `      <path d="${chipText.d}" fill="${accent}" />`
    );
    chipX += chipW + 8;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 240" width="100%" height="100%" role="img" aria-label="${escapeXml(entry.alt)}">
${renderSharedDefs("banner")}
  <rect x="1" y="1" width="878" height="238" rx="20" fill="url(#banner-bg)" stroke="${SHARED_BRAND.colors.cardBorderBanner}" stroke-width="2" />
  <g transform="translate(32, 12.48) scale(0.42)">
${renderModuleMark(entry.name)}
  </g>
  <g transform="translate(264, 0)">
${wordmarkSvg}
    <path d="${taglinePath.d}" fill="${SHARED_BRAND.colors.taglineFill}" />
    <g id="chips-${entry.name}">
${chipItems.join("\n")}
    </g>
  </g>
</svg>
`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function main() {
  const modules: ModuleEntry[] = JSON.parse(readFileSync(MODULES_PATH, "utf8"));
  for (const mod of modules) {
    const modOutDir = join(OUT_DIR, mod.name);
    mkdirSync(modOutDir, { recursive: true });
    writeFileSync(join(modOutDir, "logo.svg"), renderLogoSvg(mod), "utf8");
    writeFileSync(join(modOutDir, "banner.svg"), renderBannerSvg(mod), "utf8");
  }
  console.log(`Generated ${modules.length} logos and ${modules.length} banners in ${OUT_DIR}`);
}

main();
