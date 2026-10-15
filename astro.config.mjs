// @ts-check
import {defineConfig, fontProviders} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sanity from "@sanity/astro";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [
        icon({
            include: {
                pixelarticons: ["*"]
            },
        }),
        sanity({
            projectId: "g1i4dle8",
            dataset: "production",
            useCdn: false,
            apiVersion: '2026-10-15'
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