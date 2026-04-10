import {defineField, defineType} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'School Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Album Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Photo',
      type: 'image',
      options: {
        hotspot: true, // Enables the cropping/focus tool!
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Events', value: 'events'},
          {title: 'Infrastructure', value: 'infrastructure'},
          {title: 'Classroom', value: 'classroom'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Photo Description',
      type: 'string',
    }),
  ],
})
