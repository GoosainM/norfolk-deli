export default {
  name: 'eventItem',
  title: 'Events',
  type: 'document',
  fields: [
    { name: 'title', title: 'Event Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'eventDate', title: 'Event Date & Time', type: 'datetime', validation: (Rule: any) => Rule.required() },
    { name: 'location', title: 'Location', type: 'string', initialValue: 'Norfolk Deli, Sea Point' },
    { name: 'description', title: 'Event Details', type: 'text' },
    { name: 'poster', title: 'Event Flyer / Image', type: 'image', options: { hotspot: true } },
    { name: 'isUpcoming', title: 'Is Upcoming Event?', type: 'boolean', initialValue: true },
  ],
};