import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shortcut Academy',
  description: 'Learn keyboard shortcuts while fighting an AI rival.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
