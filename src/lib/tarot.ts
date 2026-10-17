const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

// pastel [top, art-window] pairs, cycled per card
const PALETTE = [
    ['#FFB3D9', '#FFD6EC'],
    ['#CDB4FF', '#E4D6FF'],
    ['#A8DCFF', '#D2EEFF'],
    ['#B8F2D8', '#DDF8EC'],
    ['#FFF1A8', '#FFF8D0'],
] as const;

/** Card numeral for the card at `index` in the deck (0-based). */
export const numeralFor = (index: number) => ROMAN[(index + 1) % ROMAN.length];

/** Per-card CSS variables: pastel pair plus alternating tilt. */
export const cardStyle = (index: number) => {
    const [c1, c2] = PALETTE[index % PALETTE.length];
    return `--c1:${c1}; --c2:${c2}; --tilt:${index % 2 === 0 ? '-2deg' : '2deg'}`;
};
