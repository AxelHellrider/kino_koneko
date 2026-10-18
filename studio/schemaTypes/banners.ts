import {defineType, defineField} from 'sanity';

// The color picker also offers gradients; these fields need a plain color.
const solidOnly = (rule: any) =>
    rule.custom((color: any) =>
        color?.isGradient ? 'Please pick a solid color (switch the picker to "Solid").' : true,
    );
const colorOptions = {enableAlpha: false};

export const banner = defineType({
    name: 'banner',
    type: 'document',
    title: 'Banner',
    fieldsets: [
        {name: 'design', title: 'Design', options: {collapsible: true, collapsed: false}},
        {name: 'poster', title: 'Poster layout', options: {collapsible: true, collapsed: false}},
        {name: 'figureLayout', title: 'Figure position (Classic layout)', options: {collapsible: true, collapsed: false}},
        {name: 'figureMotion', title: 'Figure animation', options: {collapsible: true, collapsed: false}},
        {name: 'textStyle', title: 'Text colors', options: {collapsible: true, collapsed: false}},
        {name: 'buttonStyle', title: 'Button style', options: {collapsible: true, collapsed: false}},
    ],
    fields: [
        defineField({
            name: 'title',
            type: 'text',
            rows: 3,
            description: 'One line per row. The Poster layout stacks the lines (and can color one of them).',
            validation: (r) => r.required(),
        }),
        defineField({name: 'description', type: 'text', rows: 2}),
        defineField({
            name: 'background',
            type: 'image',
            options: {hotspot: true},
            fields: [
                defineField({name: 'alt', type: 'string', title: 'Alt text'}),
                defineField({name: 'color', type: 'color', title: 'Color Pick'}),
            ],
        }),
        defineField({
            name: 'figure',
            type: 'image',
            description: 'Transparent PNG or WebP works best.',
            options: {hotspot: true},
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

        // ---- Design ----
        defineField({
            name: 'theme',
            title: 'Design theme',
            type: 'string',
            fieldset: 'design',
            description: 'A ready-made look: colors, title style, button and background decoration. Anything you set below overrides the theme.',
            options: {
                list: [
                    {title: 'None (plain)', value: 'none'},
                    {title: 'TWEWY', value: 'twewy'},
                    {title: 'Persona 5', value: 'persona5'},
                    {title: 'Marvel / DC comics', value: 'comic'},
                    {title: 'One Piece', value: 'onepiece'},
                ],
            },
            initialValue: 'none',
        }),
        defineField({
            name: 'layout',
            title: 'Layout',
            type: 'string',
            fieldset: 'design',
            description: 'Classic: text beside the figure. Poster: a giant word behind a centered figure, with the text at the bottom.',
            options: {
                list: [
                    {title: 'Classic', value: 'split'},
                    {title: 'Poster (giant text behind the figure)', value: 'poster'},
                ],
                layout: 'radio',
            },
            initialValue: 'split',
        }),

        // ---- Poster layout ----
        defineField({
            name: 'posterFigure',
            title: 'Figure position',
            type: 'string',
            fieldset: 'poster',
            description: 'Where the figure stands. The text block moves to the other side. Works best with a tall image that runs top to bottom.',
            options: {
                list: [
                    {title: 'Left', value: 'left'},
                    {title: 'Center', value: 'center'},
                    {title: 'Right', value: 'right'},
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'center',
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),
        defineField({
            name: 'backdropText',
            title: 'Giant background word',
            type: 'string',
            fieldset: 'poster',
            description: 'Short and in capitals works best, for example VOID ROOM.',
            validation: (r) => r.max(24),
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),
        defineField({
            name: 'backdropColor',
            title: 'Giant word color',
            type: 'color',
            fieldset: 'poster',
            options: colorOptions,
            validation: solidOnly,
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),
        defineField({
            name: 'tags',
            title: 'Small tags',
            type: 'array',
            of: [{type: 'string', validation: (r: any) => r.max(16)}],
            fieldset: 'poster',
            description: 'Up to 2 small labels above the title, like CHARACTER or VOID.',
            validation: (r) => r.max(2),
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),
        defineField({
            name: 'sideText',
            title: 'Vertical side text',
            type: 'string',
            fieldset: 'poster',
            description: 'A short line written vertically on the right edge (any language).',
            validation: (r) => r.max(24),
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),
        defineField({
            name: 'titleAccentLine',
            title: 'Title line to highlight',
            type: 'number',
            fieldset: 'poster',
            description: 'Which title line gets the highlight color: 1, 2, 3. Leave empty for none.',
            validation: (r) => r.integer().min(1).max(3),
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),
        defineField({
            name: 'titleAccentColor',
            title: 'Highlight color',
            type: 'color',
            fieldset: 'poster',
            options: colorOptions,
            validation: solidOnly,
            hidden: ({parent}) => parent?.layout !== 'poster',
        }),

        // ---- Figure position ----
        defineField({
            name: 'figureSide',
            title: 'Figure side',
            type: 'string',
            fieldset: 'figureLayout',
            description: 'Classic layout only. Desktop: the figure sits left or right of the text. Mobile: it is aligned left or right under the text.',
            options: {list: [{title: 'Left', value: 'left'}, {title: 'Right', value: 'right'}], layout: 'radio', direction: 'horizontal'},
            initialValue: 'right',
            hidden: ({parent}) => parent?.layout === 'poster',
        }),
        defineField({
            name: 'figureSideApplyTo',
            title: 'Apply the side to',
            type: 'string',
            fieldset: 'figureLayout',
            description: 'Devices that use the side above. The other devices keep the default layout (right on desktop, centered on mobile).',
            options: {
                list: [
                    {title: 'Both', value: 'both'},
                    {title: 'Desktop only', value: 'desktop'},
                    {title: 'Mobile only', value: 'mobile'},
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'both',
            hidden: ({parent}) => parent?.layout === 'poster',
        }),

        // ---- Figure animation ----
        defineField({
            name: 'figureAnimation',
            title: 'Animation',
            type: 'object',
            fieldset: 'figureMotion',
            description: "Plays every time this banner comes into view. Leave empty to use the theme's feel (or a smooth slide-in).",
            options: {columns: 2},
            fields: [
                defineField({
                    name: 'type',
                    type: 'string',
                    options: {
                        list: [
                            {title: 'Slide in', value: 'slide'},
                            {title: 'Fade', value: 'fade'},
                            {title: 'Slide in + fade', value: 'slide-fade'},
                            {title: 'None', value: 'none'},
                        ],
                    },
                }),
                defineField({
                    name: 'direction',
                    title: 'Slide from',
                    type: 'string',
                    description: '"Automatic" slides in from its own side on desktop and from below on mobile.',
                    options: {
                        list: [
                            {title: 'Automatic', value: 'auto'},
                            {title: 'Left', value: 'left'},
                            {title: 'Right', value: 'right'},
                            {title: 'Top', value: 'top'},
                            {title: 'Bottom', value: 'bottom'},
                        ],
                    },
                    hidden: ({parent}) => !['slide', 'slide-fade'].includes(parent?.type),
                }),
                defineField({
                    name: 'ease',
                    title: 'Easing',
                    type: 'string',
                    options: {
                        list: [
                            {title: 'Smooth', value: 'power3.out'},
                            {title: 'Soft', value: 'power2.out'},
                            {title: 'Snappy', value: 'expo.out'},
                            {title: 'Overshoot (bouncy)', value: 'back.out(1.4)'},
                            {title: 'Elastic', value: 'elastic.out(1,0.6)'},
                            {title: 'Gentle in-out', value: 'sine.inOut'},
                            {title: 'Linear', value: 'none'},
                        ],
                    },
                    hidden: ({parent}) => parent?.type === 'none',
                }),
                defineField({
                    name: 'duration',
                    title: 'Duration (ms) — 1 sec = 1000 ms',
                    type: 'number',
                    description: 'How long the animation takes, in milliseconds. 200 to 3000.',
                    validation: (r) => r.min(200).max(3000),
                    hidden: ({parent}) => parent?.type === 'none',
                }),
                defineField({
                    name: 'delay',
                    title: 'Delay (ms) — 1 sec = 1000 ms',
                    type: 'number',
                    description: 'How long to wait before it starts, in milliseconds. 0 to 2000.',
                    validation: (r) => r.min(0).max(2000),
                    hidden: ({parent}) => parent?.type === 'none',
                }),
            ],
        }),

        // ---- Text colors ----
        defineField({
            name: 'titleColor',
            title: 'Title text color',
            type: 'color',
            fieldset: 'textStyle',
            options: colorOptions,
            validation: solidOnly,
        }),
        defineField({
            name: 'titleShadowColor',
            title: 'Title text shadow color',
            type: 'color',
            fieldset: 'textStyle',
            options: colorOptions,
            validation: solidOnly,
        }),
        defineField({
            name: 'bodyColorMode',
            title: 'Body text color',
            type: 'string',
            fieldset: 'textStyle',
            description: 'Applies to the description and the button, not the title.',
            options: {
                list: [
                    {title: 'Same as title', value: 'same'},
                    {title: 'Custom', value: 'custom'},
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'same',
        }),
        defineField({
            name: 'bodyColor',
            title: 'Custom body text color',
            type: 'color',
            fieldset: 'textStyle',
            options: colorOptions,
            validation: solidOnly,
            hidden: ({parent}) => parent?.bodyColorMode !== 'custom',
        }),

        // ---- Button style ----
        defineField({
            name: 'buttonTheme',
            title: 'Button theme',
            type: 'string',
            fieldset: 'buttonStyle',
            description: "The look of the button: colors, outline, shadow and tilt. 'Match the design theme' follows the banner's theme; pick another to mix, for example a plain banner with a TWEWY button.",
            options: {
                list: [
                    {title: 'Match the design theme', value: 'match'},
                    {title: 'None (plain white)', value: 'none'},
                    {title: 'TWEWY (yellow, ink outline)', value: 'twewy'},
                    {title: 'Persona 5 (black, white edge)', value: 'persona5'},
                    {title: 'Marvel / DC comics (red, black outline)', value: 'comic'},
                    {title: 'One Piece (red, brown edge)', value: 'onepiece'},
                ],
            },
        }),
        defineField({
            name: 'buttonShape',
            title: 'Button shape',
            type: 'string',
            fieldset: 'buttonStyle',
            description: 'Applies to the button below (it only shows when the banner has a link). "Match the theme" uses the shape that suits the button theme.',
            options: {
                list: [
                    {title: 'Match the theme', value: 'match'},
                    {title: 'Classic (square edges)', value: 'classic'},
                    {title: 'Semi-rounded', value: 'semi'},
                    {title: 'Rounded (pill)', value: 'rounded'},
                    {title: 'Action (slanted, TWEWY-style)', value: 'action'},
                ],
                layout: 'radio',
            },
        }),        defineField({
            name: 'buttonColor',
            title: 'Button fill color',
            type: 'color',
            fieldset: 'buttonStyle',
            description: "Leave empty to use the button theme's color (white if there is none).",
            options: colorOptions,
            validation: solidOnly,
        }),
        defineField({
            name: 'buttonTextColor',
            title: 'Button text color',
            type: 'color',
            fieldset: 'buttonStyle',
            description: "Leave empty to use the button theme's color (dark ink if there is none).",
            options: colorOptions,
            validation: solidOnly,
        }),

        defineField({name: 'linkLabel', type: 'string', title: 'Button label'}),
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
    orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
    preview: {
        select: {title: 'title', media: 'figure', active: 'active'},
        prepare: ({title, media, active}) => ({
            title,
            subtitle: active === false ? 'Hidden' : 'Visible',
            media,
        }),
    },
});
