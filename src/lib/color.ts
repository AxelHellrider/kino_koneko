export type Color = {
    hex?: string,
    hex2?: string,
    angle?: number,
    isGradient?: boolean
}

// CMS values end up inside an inline `style`, so only plain hex colors pass
const HEX = /^#[0-9a-f]{3,8}$/i;

/** The plain hex of a color, or undefined if it isn't a valid one. */
export const safeHex = (c?: Color) => (c?.hex && HEX.test(c.hex) ? c.hex : undefined);

export const colorVars =(c?: Color) => {
    if (!c?.hex || !HEX.test(c.hex)) return undefined;
    if (!(c.isGradient && c.hex2 && HEX.test(c.hex2))) return c.hex;
    const angle = Number.isFinite(c.angle) ? c.angle : 135;
    return `linear-gradient(${angle}deg,${c.hex},${c.hex2})`;
}

const HEX6 = /^#[0-9a-f]{6}$/i;

/**
 * Color of the gradient where it meets the top edge of a portrait phone screen
 * (used to tint the status bar). Falls back to the first color for solid/odd values.
 */
export const topEdgeColor = (c?: Color) => {
    const first = safeHex(c);
    if (!first || !c?.isGradient || !c.hex2 || !HEX6.test(first) || !HEX6.test(c.hex2)) return first;
    const rad = ((Number.isFinite(c.angle) ? c.angle! : 135) * Math.PI) / 180;
    const [w, h] = [390, 850];
    // position (0-1) along the CSS gradient line of the top-center point
    const length = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
    const t = Math.min(1, Math.max(0, 0.5 + (h / 2) * Math.cos(rad) / length));
    const mix = (i: number) => {
        const a = parseInt(first.slice(i, i + 2), 16);
        const b = parseInt(c.hex2!.slice(i, i + 2), 16);
        return Math.round(a + (b - a) * t).toString(16).padStart(2, '0');
    };
    return `#${mix(1)}${mix(3)}${mix(5)}`;
};
