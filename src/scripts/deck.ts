import {setFlipped} from './tarot';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Wires up the deck: cards (already sorted by `order`) are hidden, then
 * revealed one by one from the deck button. When none are left, the button
 * puts them back.
 */
export const initDeck = (root: HTMLElement) => {
    const btn = root.querySelector<HTMLButtonElement>('[data-deck-btn]')!;
    const top = root.querySelector<HTMLElement>('[data-deck-top]')!;
    const label = root.querySelector<HTMLElement>('[data-deck-label]')!;
    const count = root.querySelector<HTMLElement>('[data-deck-count]')!;
    const status = root.querySelector<HTMLElement>('[data-deck-status]');
    const layers = [...root.querySelectorAll<HTMLElement>('[data-deck-layer]')];
    const cards = [...root.querySelectorAll<HTMLElement>('[data-spread] > [data-tarot]')];
    let drawn = 0;

    const render = () => {
        const left = cards.length - drawn;
        btn.dataset.empty = String(left === 0);
        // fewer layers as the deck thins out
        layers.forEach((layer, i) => (layer.hidden = left <= layers.length - 1 - i));
        label.textContent = left === 0
            ? 'Tap to put the cards back'
            : drawn === 0 ? 'Tap the deck to draw a card' : 'Draw another';
        count.textContent = `${left} of ${cards.length} left in the deck`;
    };

    const animateDraw = async (card: HTMLElement) => {
        const {default: gsap} = await import('gsap');
        const from = btn.getBoundingClientRect();
        const to = card.getBoundingClientRect();
        gsap.from(card, {
            x: from.left + from.width / 2 - (to.left + to.width / 2),
            y: from.top + from.height / 2 - (to.top + to.height / 2),
            scale: 0.5,
            rotation: -12,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.4)',
            // only drop what GSAP set; the card's inline --c1/--c2/--tilt vars must stay
            clearProps: 'transform,opacity',
        });
        gsap.fromTo(top, {y: 4}, {y: 0, duration: 0.25, ease: 'power2.out', clearProps: 'transform'});
    };

    const draw = () => {
        const card = cards[drawn++];
        card.hidden = false;
        render();
        // announced to screen readers
        if (status) status.textContent = `Drew ${card.querySelector('h3')?.textContent?.trim() ?? 'a card'}. ${cards.length - drawn} left.`;
        if (!reduceMotion.matches) animateDraw(card);
        // keep the new card in view on small screens
        card.scrollIntoView({behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'nearest'});
    };

    const reset = () => {
        cards.forEach((card) => {
            card.hidden = true;
            setFlipped(card, false);
        });
        drawn = 0;
        render();
        if (status) status.textContent = 'Cards put back in the deck.';
    };

    cards.forEach((card) => (card.hidden = true));
    render();

    // hidden cards' lazy images never load, so fetch them quietly once the page is idle
    const preload = () =>
        cards.forEach((card) => {
            const img = card.querySelector('img');
            if (img) Object.assign(new Image(), {srcset: img.srcset, sizes: img.sizes, src: img.currentSrc || img.src});
        });
    'requestIdleCallback' in window ? requestIdleCallback(preload) : setTimeout(preload, 2000);
    btn.addEventListener('click', () => (drawn >= cards.length ? reset() : draw()));
};
