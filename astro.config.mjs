// @ts-check
import {defineConfig, fontProviders} from 'astro/config';

import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import sanity from "@sanity/astro";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    // pages are static unless they set `prerender = false` (the home page does)
    adapter: netlify(),
    security: {
        // hashes every inline script Astro emits; anything injected is blocked
        csp: {
            // inline `style` attributes (per-card colors, banner backgrounds) can't be hashed
            styleDirective: {resources: ["'self'", "'unsafe-inline'"]},
            directives: [
                "default-src 'none'",
                "img-src 'self' https://cdn.sanity.io data:",
                "font-src 'self'",
                "connect-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'none'",
            ],
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [
        icon({
            include: {
                pixelarticons: ["home", "info-box", "shirt", "chat"]
            },
        }),
        sanity({
            projectId: "g1i4dle8",
            dataset: "production",
            useCdn: true,
            perspective: 'published',
            apiVersion: '2026-10-16'
        }),
    ],
    fonts: [
        {
            name: "Bungee",
            cssVariable: "--font-retro-pop",
            provider: fontProviders.google(),
            fallbacks: ["sans-serif"],
        },
    ],
});
