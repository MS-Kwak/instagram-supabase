'use client';

import Link from 'next/link';
import {
  Home,
  Logout,
  People,
  Search,
  Send,
} from '@mui/icons-material';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';

export default function Sidebar() {
  const supabase = createBrowserSupabaseClient();

  const onClickSignOut = async () => {
    supabase.auth.signOut();
  };

  return (
    <aside className="h-screen p-6 border-r border-gray-300 w-fit flex flex-col justify-between bg-white">
      {/* home버튼 ~ people ~ chat page */}
      <div className="flex flex-col gap-4">
        <Link href="/">
          <Home className="text-2xl mb-10" />
        </Link>
        <Link href="/people">
          <People className="text-2xl" />
        </Link>
        <Link href="/discover">
          <Search className="text-2xl" />
        </Link>
        <Link href="/chat">
          <Send className="text-2xl" />
        </Link>
      </div>

      {/* logout버튼 */}
      <div>
        <button onClick={onClickSignOut}>
          <Logout className="text-2xl text-purple-500" />
        </button>
      </div>
    </aside>
  );
}
