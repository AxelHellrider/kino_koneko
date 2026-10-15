import {defineType, defineField, defineArrayMember} from 'sanity';

export const product = defineType({
    name: 'product',
    type: 'document',
    title: 'Product',
    fields: [
        {
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required()
        },
        {
            name: 'category',
            type: 'string',
            options: {list: ['tee', 'postcard', 'poster', 'sticker']}
        },
        {name: 'price', type: 'number'},
        {name: 'description', type: 'text'},
        {
            name: 'main_artwork',
            type: 'image'
        },
        {
            name: 'designs',
            type: 'array',
            of: [{
                type: 'object',
                name: 'design',
                fields: [
                    {
                        name: 'name',
                        type: 'string'},
                    {
                        name: 'artwork',
                        type: 'image'
                    },
                    {
                        name: 'availability',
                        type: 'string',
                        options: {list: ['always', 'seasonal', 'retired']},
                        initialValue: 'always'
                    },
                    {
                        name: 'availabilityNote',
                        type: 'string'
                    },
                    {
                        name: 'colorways',
                        type: 'array',
                        of: [{
                            type: 'object',
                            name: 'colorway',
                            fields: [
                                {name: 'colorName', type: 'string'},
                                {name: 'colorHex', type: 'string'},
                                {name: 'mockup', type: 'image'},
                                {name: 'extraImages', type: 'array', of: [{type: 'image'}]},
                            ],
                        }]
                    },
                ],
            }]
        },
    ],
});