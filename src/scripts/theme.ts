/**
 * Mobile browsers paint the status-bar area from <meta name="theme-color"> (and
 * the page background behind it). Keep both in sync with whichever section or
 * hero slide is mostly on screen, so the bar reads as part of the page.
 */
export const initThemeColor = () => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const targets = document.querySelectorAll<HTMLElement>('[data-theme-color]');
    if (!meta || !targets.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries.find((e) => e.isIntersecting);
            const color = visible?.target.getAttribute('data-theme-color');
            if (!color) return;
            meta.content = color;
            document.documentElement.style.background = color;
        },
        {threshold: 0.6},
    );
    targets.forEach((el) => observer.observe(el));
};
