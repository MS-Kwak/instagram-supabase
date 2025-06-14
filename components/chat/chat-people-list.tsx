'use client';

import { useQuery } from '@tanstack/react-query';
import {
  presenceStateContext,
  selectedUserIdContext,
  selectedUserIndexContext,
} from '../main-layout';
import Person from './person';
import { useContext, useEffect } from 'react';
import { getAllUsers } from '@/actions/chat.action';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';

export default function ChatPeopleList({ loggedInUser }) {
  const { selectedUserId, setSelectedUserId } = useContext(
    selectedUserIdContext
  );
  const { setSelectedUserIndex } = useContext(
    selectedUserIndexContext
  );
  const { presence, setPresence } = useContext(presenceStateContext);

  const getAllUsersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      console.log('allUsers', allUsers);
      return allUsers.filter((user) => user.id !== loggedInUser.id);
    },
  });

  const supabase = createBrowserSupabaseClient();
  useEffect(() => {
    // PostgreSQL 온라인 사용자를 구독하는 채널 생성
    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: loggedInUser.id, // 현재 사용자의 ID를 키로 사용
        },
      },
    });

    channel.on(
      'presence',
      {
        event: 'sync',
      },
      () => {
        const newState = channel.presenceState();
        const newStateObj = JSON.parse(JSON.stringify(newState));
        // console.log('Presence state:', newState);
        setPresence(newStateObj); // 현재 사용자의 온라인 상태를 업데이트
      }
    );

    channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') {
        console.error('Failed to subscribe to online users channel');
        return;
      }

      // 현재 사용자의 온라인 상태를 업데이트
      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(), // 현재 시간을 ISO 문자열로 설정
      });

      console.log('User presence updated:', newPresenceStatus);
    });

    return () => {
      channel.unsubscribe(); // 컴포넌트 언마운트 시 채널 제거
    };
  }, []);

  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, index) => (
        <Person
          key={user.id}
          onClick={() => {
            setSelectedUserId(user.id);
            setSelectedUserIndex(index);
          }}
          index={index}
          userId={user.id}
          name={user.email.split('@')[0]} // Assuming email is used as name
          onlineAt={presence?.[user.id]?.[0]?.onlineAt} // Placeholder, replace with actual online status
          isActive={selectedUserId === user.id}
          onChatScreen={false}
        />
      ))}

      {/* <Person
        onClick={() => setSelectedIndex(1)}
        index={1}
        userId={`user-1`}
        name={`Shiloh`}
        onlineAt={new Date().toISOString()}
        isActive={selectedIndex === 1}
        onChatScreen={false}
      />
      <Person
        onClick={() => setSelectedIndex(2)}
        index={2}
        userId={`user-2`}
        name={`Shiloh2`}
        onlineAt={new Date().toISOString()}
        isActive={selectedIndex === 2}
        onChatScreen={false}
      /> */}
    </div>
  );
}
