import type {Banner} from './sanity';
import type {ButtonShape} from './banner';

/**
 * Ready-made looks for banners. The visuals (colors, title treatment, decoration) live in
 * src/styles/themes.css, keyed by `data-theme`. This file only holds the few defaults the
 * markup and the animation script need, and anything set explicitly on a banner wins.
 */
export const THEMES = ['none', 'twewy', 'persona5', 'comic', 'onepiece'] as const;
export type Theme = (typeof THEMES)[number];

export const themeOf = (b: Banner): Theme =>
    THEMES.includes(b.theme as Theme) ? (b.theme as Theme) : 'none';

interface Preset {
    /** button shape when the banner doesn't pick one */
    button: ButtonShape;
    /** color of the mobile status bar over this theme (matches the theme's top edge) */
    status: string;
    /** approximate color along the slide's left edge (see `.hero-slide` in themes.css) */
    edge: string;
    /** entrance feel */
    motion: {type: string; direction: string; ease: string; duration: number; delay: number};
}

export const PRESETS: Record<Exclude<Theme, 'none'>, Preset> = {
    twewy: {button: 'action', status: '#ff7a1a', edge: '#ff6a2a', motion: {type: 'slide-fade', direction: 'auto', ease: 'back.out(1.4)', duration: 700, delay: 100}},
    persona5: {button: 'action', status: '#e60012', edge: '#e60012', motion: {type: 'slide', direction: 'left', ease: 'expo.out', duration: 600, delay: 0}},
    comic: {button: 'classic', status: '#ffd400', edge: '#ffd400', motion: {type: 'slide-fade', direction: 'bottom', ease: 'back.out(1.4)', duration: 650, delay: 80}},
    onepiece: {button: 'rounded', status: '#f1dca3', edge: '#f1dca3', motion: {type: 'slide-fade', direction: 'auto', ease: 'power3.out', duration: 1000, delay: 120}},
};

export const presetOf = (b: Banner) => {
    const t = themeOf(b);
    return t === 'none' ? undefined : PRESETS[t];
};
