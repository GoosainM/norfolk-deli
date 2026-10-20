'use client';

import { NextStudio } from 'next-sanity/studio';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import bakeryItem from '@/sanity/schemas/bakeryItem';
import menuItem from '@/sanity/schemas/menuItems';
import eventItem from '@/sanity/schemas/eventItems';

import { Suspense } from 'react';
import config from '../../../sanity.config';

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading Studio...</div>}>
      <NextStudio config={config} />
    </Suspense>
  );
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xjf015sd';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const config = defineConfig({
  basePath: '/admin',
  projectId,
  dataset,
  title: 'Norfolk Deli Admin Studio',
  plugins: [structureTool()],
  schema: {
    types: [bakeryItem, menuItem, eventItem],
  },
});
