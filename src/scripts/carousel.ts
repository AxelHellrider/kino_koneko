/**
 * Accessibility for the hero carousel: a pause/play button (auto-advancing content that runs
 * longer than 5s must be stoppable) and autoplay off for people who prefer reduced motion.
 * One click listener; the Swiper instance is read lazily when it is needed.
 */
type SwiperEl = HTMLElement & {swiper?: {autoplay?: {start(): void; stop(): void}}};

export const initCarousel = () => {
    const btn = document.querySelector<HTMLButtonElement>('[data-hero-pause]');
    const el = document.querySelector<SwiperEl>('#top .swiper');
    if (!btn || !el) return;

    const setPaused = (paused: boolean) => {
        const autoplay = el.swiper?.autoplay;
        if (!autoplay) return;
        paused ? autoplay.stop() : autoplay.start();
        btn.setAttribute('aria-pressed', String(paused));
        btn.setAttribute('aria-label', paused ? 'Play banner rotation' : 'Pause banner rotation');
    };

    btn.addEventListener('click', () => setPaused(btn.getAttribute('aria-pressed') !== 'true'));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        addEventListener('load', () => setPaused(true), {once: true});
    }
};
