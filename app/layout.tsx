// app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Kotak Neo Trader',
  description: 'Minimal Kotak Neo trading dashboard built with Next.js'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
