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
                pixelarticons: ["*"],
            },
        }),
        sanity({
            projectId: "5ofkdek1",
            dataset: "production",
            useCdn: false,
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