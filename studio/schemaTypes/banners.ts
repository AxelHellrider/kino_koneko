// studio/schemaTypes/banner.ts
import { defineType, defineField } from 'sanity';

export const banner = defineType({
    name: 'banner',
    type: 'document',
    title: 'Banner',
    fields: [
        defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'description', type: 'text', rows: 2 }),
        defineField({
            name: 'background',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
                defineField({ name: 'colorPick', type: 'color', title: 'Color Pick'})
            ],
        }),
        defineField({
            name: 'figure',
            type: 'image',
            description: 'Transparent PNG or WebP works best.',
            options: { hotspot: true },
            validation: (r) => r.required(),
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alt text',
                    validation: (r) => r.required(),
                }),
            ],
        }),
        defineField({ name: 'linkLabel', type: 'string', title: 'Button label' }),
        defineField({
            name: 'linkHref',
            type: 'string',
            title: 'Button link',
            description: 'For example #shop, or a full URL.',
        }),
        defineField({
            name: 'order',
            type: 'number',
            description: 'Lower numbers show first.',
            initialValue: 10,
        }),
        defineField({
            name: 'active',
            type: 'boolean',
            title: 'Show on site',
            initialValue: true,
        }),
    ],
    orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
    preview: {
        select: { title: 'title', media: 'figure', active: 'active' },
        prepare: ({ title, media, active }) => ({
            title,
            subtitle: active === false ? 'Hidden' : 'Visible',
            media,
        }),
    },
});