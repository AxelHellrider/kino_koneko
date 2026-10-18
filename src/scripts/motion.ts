/**
 * Entrance animations for the hero slides and the page sections.
 *
 * - Markup: a container has `data-anim-group`; elements inside it with `data-anim="text"`
 *   rise in (staggered), and a `data-anim="figure"` element runs the animation chosen in
 *   Sanity (data-anim-* attributes, validated server-side).
 * - Cost: one IntersectionObserver, no scroll/resize listeners, GSAP loaded on demand, and
 *   only transform + opacity are animated, so everything stays on the GPU compositor.
 * - Without JS (or with reduced motion) nothing is hidden or animated.
 */
const SHOW_AT = 0.35; // fraction of a group that must be visible before it plays

const reveal = (els: Iterable<HTMLElement>) => {
    for (const el of els) el.style.opacity = '1';
};

export const initMotion = async () => {
    const groups = [...document.querySelectorAll<HTMLElement>('[data-anim-group]')];
    if (!groups.length) return;
    const all = groups.flatMap((g) => [...g.querySelectorAll<HTMLElement>('[data-anim]')]);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return reveal(all);

    let gsap: typeof import('gsap').default;
    try {
        gsap = (await import('gsap')).default;
    } catch {
        return reveal(all); // never leave content hidden if the animation library fails
    }

    const desktop = matchMedia('(min-width: 1024px)');
    const slideFrom = (dir: string, side: string) => {
        const from = dir === 'auto' ? (desktop.matches ? side : 'bottom') : dir;
        return {
            left: {xPercent: -60},
            right: {xPercent: 60},
            top: {yPercent: -40},
            bottom: {yPercent: 40},
        }[from as 'left'] ?? {yPercent: 40};
    };

    const play = (group: HTMLElement) => {
        const text = group.querySelectorAll<HTMLElement>('[data-anim="text"]');
        gsap.fromTo(
            text,
            {y: 28, opacity: 0},
            {y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.09, overwrite: 'auto', clearProps: 'transform'},
        );

        const backdrop = group.querySelector<HTMLElement>('[data-anim="backdrop"]');
        if (backdrop) {
            gsap.fromTo(
                backdrop,
                {opacity: 0, scale: 1.12},
                {opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform'},
            );
        }

        const fig = group.querySelector<HTMLElement>('[data-anim="figure"]');
        if (!fig) return;
        const d = fig.dataset;
        const type = d.animType ?? 'slide-fade';
        gsap.fromTo(
            fig,
            {
                opacity: type === 'slide' ? 1 : 0,
                ...(type === 'fade' ? {} : slideFrom(d.animDir ?? 'auto', d.side ?? 'right')),
            },
            {
                opacity: 1,
                xPercent: 0,
                yPercent: 0,
                duration: Number(d.animDur) || 0.9,
                delay: Number(d.animDelay) || 0,
                ease: d.animEase ?? 'power3.out',
                overwrite: 'auto',
                clearProps: 'transform',
            },
        );
    };

    const rearm = (group: HTMLElement) =>
        gsap.set(group.querySelectorAll('[data-anim]'), {opacity: 0});

    // rise 0 -> 1 plays the group; falling back to 0 hides it so it can play again on return
    const shown = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
        (entries) => {
            for (const {target, intersectionRatio} of entries) {
                const group = target as HTMLElement;
                if (intersectionRatio >= SHOW_AT && !shown.has(group)) {
                    shown.add(group);
                    play(group);
                } else if (intersectionRatio === 0 && shown.has(group)) {
                    shown.delete(group);
                    rearm(group);
                }
            }
        },
        {threshold: [0, SHOW_AT]},
    );
    groups.forEach((g) => observer.observe(g));
};
