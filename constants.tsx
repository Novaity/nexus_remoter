
import React from 'react';

export const COLORS = [
  'bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-purple-600',
  'bg-orange-600', 'bg-pink-600', 'bg-cyan-600', 'bg-indigo-600',
  'bg-slate-700', 'bg-amber-600'
];

// Changed icon functions to accept a props object instead of a direct string, fixing the type error in App.tsx
export const ICONS = {
  CHROME: ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  STEAM: ({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .001A12 12 0 0 0 .15 11.455c.101-.01.218-.01.218-.01.996 0 1.83.673 2.067 1.58.077-.024.162-.036.252-.036.216 0 .416.071.58.191l3.541-5.127a2.502 2.502 0 0 1 2.301-3.665c1.38 0 2.5 1.12 2.5 2.5 0 1.38-1.12 2.5-2.5 2.5a2.493 2.493 0 0 1-2.227-1.365l-3.376 4.888a2.531 2.531 0 0 1 .15 2.684l-4.14 1.706a12 12 0 1 0 14.484-17.38z" />
    </svg>
  ),
  GAME: ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  ),
  DEFAULT: ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
};