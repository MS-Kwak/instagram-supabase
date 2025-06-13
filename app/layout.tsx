import type { Metadata } from 'next';
import './globals.css';
import ReactQueryClientProvider from '@/config/ReactQueryClientProvider';
import { ThemeProvider } from '@/config/MaterialTailwindThemeProvider';

export const metadata: Metadata = {
  title: 'Instagram Clone',
  description: 'Instagram, Clone, Next.js, Supabase',
};

export default function RootLayout({ children }) {
  return (
    <ReactQueryClientProvider>
      <ThemeProvider value={{ mode: 'dark' }}>
        <html lang="en">
          <head>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
              integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </head>
          <body>{children}</body>
        </html>
      </ThemeProvider>
    </ReactQueryClientProvider>
  );
}
