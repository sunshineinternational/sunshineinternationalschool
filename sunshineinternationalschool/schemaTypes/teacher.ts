import {defineField, defineType} from 'sanity'

export const teacherType = defineType({
  name: 'teacher',
  title: 'Faculty & Staff',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Designation / Role',
      type: 'string',
      placeholder: 'e.g. Senior Teacher, Principal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Teacher Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
        name: 'qualification',
        title: 'Education / Qualification',
        type: 'string',
        placeholder: 'e.g. M.A, B.Ed',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
    }),
    defineField({
      name: 'priority',
      title: 'Sorting Priority',
      type: 'number',
      description: 'Higher number = appears first (e.g., set 100 for Principal).',
      initialValue: 0,
    }),
  ],
})
