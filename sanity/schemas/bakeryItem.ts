export default {
  name: 'bakeryItem',
  title: 'Bakery Pre-Orders',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Display Order Position (e.g. 1 for first, 2 for second)',
      type: 'number',
      initialValue: 99, // New items default to the end unless given a specific position
    },
    {
      name: 'title',
      title: 'Item Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (ZAR)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Savouries', value: 'Savouries' },
          { title: 'Cakes & Bakes', value: 'Cakes & Bakes' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'portion',
      title: 'Portion Info',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'inStock',
      title: 'Available for Order',
      type: 'boolean',
      initialValue: true,
    },
  ],
};