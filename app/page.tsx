import LogoutButton from '@/components/logout-button';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Image from 'next/image';

export const metadata = {
  title: 'Instagram Clone',
  keywords: 'Instagram, Clone, Next.js, Supabase',
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return (
    <main className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <Image
        src={'/inflearngram.png'}
        width={60}
        height={20}
        alt="logo"
        className="w-50 !h-auto mb-6"
      />
      <h1 className="font-bold text-xl">
        Welcome {session?.user?.email?.split('@')?.[0]}!
      </h1>
      <LogoutButton />
    </main>
  );
}
