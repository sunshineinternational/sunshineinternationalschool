import {defineField, defineType} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'School Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Photo Title / Caption',
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
      title: 'Album / Category',
      type: 'string',
      options: {
        list: [
          {title: 'Annual Function 2024-25', value: 'Annual Function 2024-25'},
          {title: 'Science Fair', value: 'Science Fair'},
          {title: 'Sports Meet', value: 'Sports Meet'},
          {title: 'Class of 2022', value: 'Class of 2022'},
          {title: 'Archive 2012-2020', value: 'Archive 2012-2020'},
          {title: 'Campus & Infrastructure', value: 'infrastructure'},
          {title: 'Classroom Activities', value: 'classroom'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Detailed Description (Optional)',
      type: 'text',
    }),
  ],
})
