export type Color = {
    hex?: string,
    hex2?: string,
    angle?: number,
    isGradient?: boolean
}

export const colorVars = (c?: Color) => {
    if (!c?.hex) return undefined;
    return c?.isGradient && c?.hex2
        ? `linear-gradient(${c?.angle ?? 135}deg,${c?.hex},${c?.hex2})`
        : c?.hex;
}