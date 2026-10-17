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
