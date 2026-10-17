/**
 * Mobile browsers paint the status-bar area from <meta name="theme-color"> (and
 * the page background behind it). Keep both in sync with the hero slide or section
 * that is coming into view.
 *
 * One IntersectionObserver, no scroll/resize listeners: it only fires when a target
 * crosses the 5% mark. We switch on the way *in* (ratio rising) rather than waiting
 * for the old slide to leave, because some browsers (Brave iOS) apply the new
 * color a beat late, which otherwise reads as "one step behind".
 */
export const initThemeColor = () => {
    const targets = document.querySelectorAll<HTMLElement>('[data-theme-color]');
    if (!targets.length) return;

    const lastRatio = new Map<Element, number>();
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    let current = meta?.content;

    const apply = (color: string) => {
        if (color === current) return;
        current = color;
        document.documentElement.style.background = color;
        // swap the element: some browsers only re-read theme-color when a meta is inserted
        const next = document.createElement('meta');
        next.name = 'theme-color';
        next.content = color;
        meta ? meta.replaceWith(next) : document.head.append(next);
        meta = next;
    };

    const observer = new IntersectionObserver(
        (entries) => {
            for (const {target, intersectionRatio} of entries) {
                const rising = intersectionRatio > (lastRatio.get(target) ?? 0);
                lastRatio.set(target, intersectionRatio);
                const color = target.getAttribute('data-theme-color');
                if (rising && color) apply(color);
            }
        },
        {threshold: 0.05},
    );
    targets.forEach((el) => observer.observe(el));
};
