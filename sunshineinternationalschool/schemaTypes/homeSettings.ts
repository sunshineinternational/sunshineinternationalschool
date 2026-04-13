import {defineField, defineType} from 'sanity'

export const homeSettingsType = defineType({
  name: 'homeSettings',
  title: 'Home Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero Slideshow',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'type', type: 'string', options: {list: ['image', 'video']}},
            {name: 'source', type: 'image', options: {hotspot: true}},
            {name: 'videoUrl', type: 'url', title: 'Video URL (Local path or external)'},
            {name: 'caption', type: 'string'},
            {name: 'ctaText', type: 'string'},
            {name: 'ctaLink', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'featuredGallery',
      title: 'Featured Home Gallery (Japanese Grid)',
      description: 'Select exactly 8 images to feature in the home bento grid.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'gallery'}]}],
      validation: (Rule) => Rule.max(8),
    }),
  ],
})
