/** Set a card face-up (front) or flipped (back with description). */
export const setFlipped = (card: HTMLElement, flipped: boolean) => {
    const inner = card.querySelector<HTMLElement>('[data-flip]');
    if (inner) inner.dataset.flipped = String(flipped);
    card.querySelector('[data-flip-btn]')?.setAttribute('aria-pressed', String(flipped));
};

/** One delegated listener flips any card whose button is clicked. */
export const initFlip = () =>
    document.addEventListener('click', (e) => {
        const btn = (e.target as Element).closest('[data-flip-btn]');
        const card = btn?.closest<HTMLElement>('[data-tarot]');
        if (card) setFlipped(card, btn!.getAttribute('aria-pressed') !== 'true');
    });
