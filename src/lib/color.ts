// WORK-PAGES §6.6: a work's accent colors white button text and links on
// white, so it must reach the WCAG AA contrast ratio against white.
const MIN_CONTRAST = 4.5;
const WHITE = "#ffffff";

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/** WCAG contrast ratio of two `#rrggbb` colors. */
export function contrastRatio(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}

/** Throws (failing the build) when the accent is too light for white. */
export function assertAccentContrast(accent: string, label: string) {
  const ratio = contrastRatio(accent, WHITE);
  if (ratio < MIN_CONTRAST) {
    throw new Error(
      `${label}: accent ${accent} has a contrast ratio of ${ratio.toFixed(2)}:1 against white; at least ${MIN_CONTRAST}:1 is required.`,
    );
  }
}
