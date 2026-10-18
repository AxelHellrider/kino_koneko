import type {Banner} from './sanity';
import {safeHex} from './color';
import {PRESETS, THEMES, presetOf, themeOf, type Theme} from './themes';

/**
 * Turns the banner's CMS fields into things the Hero can render safely: CSS variables,
 * layout classes and data attributes. Every value is checked against an allowlist
 * or clamped, so nothing arbitrary reaches the page.
 */

// solid colors only: a gradient picked by mistake is ignored
const solid = (c?: {hex?: string; isGradient?: boolean}) =>
    c && !c.isGradient ? safeHex(c) : undefined;

/** `--title-color`, `--title-shadow`, `--body-color` (only the ones that are set). */
export const bannerTextVars = (b: Banner) => {
    const title = solid(b.titleColor);
    const shadow = solid(b.titleShadowColor);
    const body = b.bodyColorMode === 'custom' ? solid(b.bodyColor) : title;
    return [
        title && `--title-color:${title}`,
        shadow && `--title-shadow:${shadow}`,
        body && `--body-color:${body}`,
    ].filter(Boolean).join(';');
};

/** Classes are written out in full so Tailwind can see them. */
export const figureLayout = (b: Banner) => {
    const side = b.figureSide === 'left' ? 'left' : 'right';
    const applyTo = b.figureSideApplyTo ?? 'both';
    const desktop = applyTo !== 'mobile' ? side : 'right';
    const mobile = applyTo !== 'desktop' ? side : 'center';
    return {
        slide: desktop === 'left' ? 'lg:flex-row-reverse' : '',
        figure: mobile === 'left' ? 'max-lg:self-start' : mobile === 'right' ? 'max-lg:self-end' : '',
        desktopSide: desktop,
    };
};

export const BUTTON_SHAPES = ['classic', 'semi', 'rounded', 'action'] as const;
export type ButtonShape = (typeof BUTTON_SHAPES)[number];
/** Which theme the button wears: its own pick, or the banner's design theme. */
export const buttonTheme = (b: Banner): Theme =>
    THEMES.includes(b.buttonTheme as Theme) ? (b.buttonTheme as Theme) : themeOf(b);

export const buttonShape = (b: Banner): ButtonShape =>
    BUTTON_SHAPES.includes(b.buttonShape as ButtonShape)
        ? (b.buttonShape as ButtonShape)
        : (PRESETS[buttonTheme(b) as Exclude<Theme, 'none'>]?.button ?? 'semi');

/** Explicit button colors from Sanity (they beat the button theme's defaults). */
export const buttonVars = (b: Banner) => {
    const bg = solid(b.buttonColor);
    const fg = solid(b.buttonTextColor);
    return [bg && `--btn-bg:${bg}`, fg && `--btn-fg:${fg}`].filter(Boolean).join(';');
};

const TYPES = ['slide', 'fade', 'slide-fade', 'none'];
const DIRECTIONS = ['auto', 'left', 'right', 'top', 'bottom'];
const EASES = ['power3.out', 'power2.out', 'expo.out', 'back.out(1.4)', 'elastic.out(1,0.6)', 'sine.inOut', 'none'];
const clamp = (n: unknown, min: number, max: number, fallback: number) =>
    typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
const pick = <T extends string>(v: unknown, allowed: T[], fallback: T) =>
    allowed.includes(v as T) ? (v as T) : fallback;

/** Data attributes the motion script reads. Empty when the animation is turned off. */
export const figureMotion = (b: Banner, desktopSide: string): Record<string, string> => {
    // explicit fields win, then the theme's feel, then the global default
    const set = Object.fromEntries(Object.entries(b.figureAnimation ?? {}).filter(([, v]) => v != null));
    const a: NonNullable<Banner['figureAnimation']> = {...presetOf(b)?.motion, ...set};
    const type = pick(a.type, TYPES, 'slide-fade');
    if (type === 'none') return {};
    return {
        'data-anim': 'figure',
        'data-anim-type': type,
        'data-anim-dir': pick(a.direction, DIRECTIONS, 'auto'),
        'data-anim-ease': pick(a.ease, EASES, 'power3.out'),
        // the CMS stores milliseconds; GSAP (and the motion script) work in seconds
        'data-anim-dur': String(clamp(a.duration, 200, 3000, 900) / 1000),
        'data-anim-delay': String(clamp(a.delay, 0, 2000, 150) / 1000),
        'data-side': desktopSide,
    };
};

/** Poster layout: the giant word's size (in vw) so short and long words both fill the width. */
export const backdropSize = (text: string) => {
    const chars = Array.from(text).length || 1;
    return Math.min(24, Math.max(7, 94 / (chars * 1.0)));
};

export const posterColors = (b: Banner) => {
    const backdrop = solid(b.backdropColor);
    const accent = solid(b.titleAccentColor);
    return [backdrop && `--backdrop-color:${backdrop}`, accent && `--title-accent:${accent}`]
        .filter(Boolean).join(';');
};

export const titleLines = (title: string) =>
    title.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 4);
