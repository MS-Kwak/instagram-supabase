import type { Metadata } from 'next';
import './globals.css';
import ReactQueryClientProvider from '@/config/ReactQueryClientProvider';
import { ThemeProvider } from '@/config/MaterialTailwindThemeProvider';
import AuthProvider from '@/config/AuthProvider';
import MainLayout from '@/components/main-layout';
import Auth from '@/components/auth';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Instagram Clone',
  description: 'Instagram, Clone, Next.js, Supabase',
};

export default async function RootLayout({ children }) {
  // const loggedIn = false; // This can be replaced with actual authentication logic
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log('session', session, error);

  return (
    <ReactQueryClientProvider>
      <ThemeProvider value={{ mode: 'light' }}>
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
          <body>
            <AuthProvider accessToken={session?.access_token}>
              {session?.user ? (
                <MainLayout>{children}</MainLayout>
              ) : (
                <Auth />
              )}
            </AuthProvider>
          </body>
        </html>
      </ThemeProvider>
    </ReactQueryClientProvider>
  );
}
