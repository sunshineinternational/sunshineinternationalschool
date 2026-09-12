import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'School Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image (Poster)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Event Description',
      type: 'text',
    }),
    defineField({
      name: 'gallery',
      title: 'Event Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.max(10).warning('Maximum 10 photos allowed per event.'),
      description: 'Upload up to 10 photos for this specific event. You can select or drag-and-drop multiple photos at once.',
    }),
    defineField({
      name: 'showOnHome',
      title: 'Show on Home Page?',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this on to show this event in the "Latest Events" section of the home page.',
    }),
  ],
})
