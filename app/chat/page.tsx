import ChatPeopleList from '@/components/chat/chat-people-list';
import ChatScreen from '@/components/chat/chat-screen';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export default async function ChatPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <ChatPeopleList loggedInUser={session?.user} />
      <ChatScreen />
    </main>
  );
}
