export default {
  name: 'menuItem',
  title: 'Cafe Menu Items',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Display Order Position',
      type: 'number',
      initialValue: 99,
    },
    {
      name: 'name',
      title: 'Item Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (ZAR)',
      type: 'number',
      description: 'Leave blank if this item only has sub-options or add-ons.',
    },
    {
      name: 'menuType',
      title: 'Menu Section',
      type: 'string',
      options: {
        list: [
          { title: 'Drinks Menu', value: 'drinks' },
          { title: 'Food Menu', value: 'food' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category Header (e.g., HOT DRINKS, ALL DAY BRUNCH, EXTRAS)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description / Ingredients / Sub-text',
      type: 'text',
    },
    // Array for Add-Ons / Variations (e.g. "add avo +25", "add sourdough +20")
    {
      name: 'addOns',
      title: 'Add-Ons / Variations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Add-On Name (e.g., add avo)', type: 'string' },
            { name: 'price', title: 'Price (ZAR)', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'isVegan',
      title: 'Vegan Item',
      type: 'boolean',
      initialValue: false,
    },
  ],
};