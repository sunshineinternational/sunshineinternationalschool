import {defineField, defineType} from 'sanity'

export const noticeType = defineType({
  name: 'notice',
  title: 'Notice Board',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Notice Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date of Notice',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'External Link / PDF URL',
      type: 'url',
      description: 'Useful if this notice leads to a result or a PDF.',
    }),
    defineField({
      name: 'content',
      title: 'Notice Content',
      type: 'text',
      description: 'The actual text of the notice.',
    }),
  ],
})
