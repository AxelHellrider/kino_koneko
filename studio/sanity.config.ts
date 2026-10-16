import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {customColorPicker} from 'sanity-plugin-color-input'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'


export default defineConfig({
    name: 'default',
    title: 'kino-koneko',

    projectId: 'g1i4dle8',
    dataset: 'production',

    plugins: [
        structureTool(),
        visionTool(),
        customColorPicker()
    ],

    schema: {
        types: schemaTypes,
    },
})
