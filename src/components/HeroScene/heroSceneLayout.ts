export type HeroSceneLayout = {
  cameraZ: number;
  cameraY: number;
  fov: number;
  modelScale: number;
  groundY: number;
  startX: number;
  walkSpeed: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** ~1.85 world units tall at scale 1 for the hoodie model */
const BASE_CHAR_HEIGHT = 1.85;

/**
 * Derive camera + model transforms so the character fills a similar portion
 * of the canvas across portrait phones, tablets, and wide desktops.
 */
export function getHeroSceneLayout(width: number, height: number): HeroSceneLayout {
  const w = Math.max(width, 320);
  const h = Math.max(height, 280);
  const aspect = w / h;

  // Aim for ~40–44% of viewport height occupied by the character
  const targetScreenFraction = clamp(
    aspect > 1.25 ? 0.44 : aspect < 0.8 ? 0.4 : 0.42,
    0.38,
    0.46
  );

  let fov: number;
  if (aspect < 0.72) fov = 50;
  else if (aspect < 0.95) fov = 44;
  else if (aspect < 1.35) fov = 38;
  else if (aspect < 1.75) fov = 34;
  else fov = 30;

  // Wider aspect → narrower FOV + closer camera so the model doesn't shrink
  const wideT = clamp((aspect - 1) / 1.25, 0, 1);
  let cameraZ = lerp(6.2, 3.85, wideT);

  // Portrait / short canvas (mobile grid middle row)
  if (aspect < 0.85) {
    cameraZ = lerp(7.4, 5.6, clamp((aspect - 0.55) / 0.3, 0, 1));
  }
  const shortT = clamp(1 - h / 640, 0, 1);
  cameraZ += shortT * 1.0;

  const visibleHeight = 2 * cameraZ * Math.tan((fov * Math.PI) / 360);
  let modelScale = (targetScreenFraction * visibleHeight) / BASE_CHAR_HEIGHT;
  modelScale = clamp(modelScale, 0.95, 1.85);

  const cameraY = lerp(0.3, 0.55, clamp((aspect - 0.55) / 1.5, 0, 1));
  const groundY = -0.92 - (modelScale - 1.1) * 0.14;

  const visibleWidth = visibleHeight * aspect;
  const startX = clamp(visibleWidth * 0.4, 0.85, 6.2);
  const walkSpeed = clamp(2.1 + startX * 0.2, 2.1, 3.5);

  return {
    cameraZ,
    cameraY,
    fov,
    modelScale,
    groundY,
    startX,
    walkSpeed,
  };
}
