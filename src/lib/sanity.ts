import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '1yighcjz',
  dataset: 'production',
  useCdn: true, // Use the edge network for lightning fast loading
  apiVersion: '2024-04-10', // Use today's date for the latest features
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
