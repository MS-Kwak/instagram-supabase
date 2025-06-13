'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { Button } from '@material-tailwind/react';

export default function LogoutButton() {
  const supabase = createBrowserSupabaseClient();

  const onClickSignOut = async () => {
    supabase.auth.signOut();
  };

  return (
    <Button
      onClick={onClickSignOut}
      className="border-[#f14346] bg-[#f14346] text-white hover:border-[#f14346] hover:bg-[#f14346] hover:brightness-110 py-2 px-4 rounded-md"
    >
      로그아웃
    </Button>
  );
}
