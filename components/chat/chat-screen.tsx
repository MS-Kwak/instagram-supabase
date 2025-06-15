'use client';

import { Button } from '@mui/material';
import Person from './person';
import Message from './message';
import { useContext, useEffect, useState } from 'react';
import {
  presenceStateContext,
  selectedUserIdContext,
  selectedUserIndexContext,
} from '../main-layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAllMessages,
  getUserById,
  sendMessage,
} from '@/actions/chat.action';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';

export default function ChatScreen() {
  const { selectedUserId } = useContext(selectedUserIdContext);
  const { selectedUserIndex } = useContext(selectedUserIndexContext);
  const [message, setMessage] = useState('');
  const supabase = createBrowserSupabaseClient();
  const { presence } = useContext(presenceStateContext);

  const selectedUserQuery = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => getUserById(selectedUserId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({
        message,
        chatUserId: selectedUserId,
      });
    },
    onSuccess: () => {
      setMessage(''); // Clear the input after sending the message
      getAllMessagesQuery.refetch(); // 메시지를 보낼 때마다 전체 메시지 목록을 다시 가져옴
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ['messages', selectedUserId],
    queryFn: () => getAllMessages({ chatUserId: selectedUserId }),
  });

  useEffect(() => {
    const channel = supabase
      .channel('message_postgres_changes') // PostgreSQL 변경 사항을 구독하는 채널 생성
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message' },
        (payload) => {
          // console.log('Change received!', payload);
          if (payload.eventType === 'INSERT' && !payload.errors) {
            getAllMessagesQuery.refetch(); // 새로운 메시지가 들어오면 전체 메시지 목록을 다시 가져옴
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe(); // 컴포넌트 언마운트 시 채널 구독 해제 (useEffect의 cleanup 함수)
    };
  }, []);

  return selectedUserQuery.data !== null ? (
    <div className="w-full h-screen flex flex-col">
      {/* Active 유저 영역 */}
      <Person
        index={selectedUserIndex}
        userId={selectedUserQuery?.data?.id}
        name={selectedUserQuery.data?.email?.split('@')?.[0]} // Assuming email is used as name
        onlineAt={presence?.[selectedUserId]?.[0]?.onlineAt} // Placeholder, replace with actual online status
        isActive={false}
        onChatScreen={true}
      />

      {/* 채팅 영역 */}
      <div className="w-full overflow-y-scroll flex flex-1 flex-col p-4 gap-3">
        {getAllMessagesQuery.data?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            isFromMe={message.receiver === selectedUserId} // 메시지의 수신자가 현재 선택된 유저인 경우 내가 보낸 메시지가 된다!!
          />
        ))}
      </div>

      {/* 채팅input 영역 */}
      <div className="flex relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-3 w-full border-2 border-blue-500 pr-10 outline-0" // padding-right 조정
          type="text"
          placeholder="메시지를 입력해주세요"
        />
        <Button
          onClick={() => {
            if (message.trim() !== '') {
              sendMessageMutation.mutate();
            }
          }}
          style={{ backgroundColor: '#1877F2', color: 'white' }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 hover:bg-[#1877F2] hover:brightness-110 !rounded-none"
          loading={sendMessageMutation.isPending}
          title="전송"
        >
          전송
        </Button>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen flex flex-col"></div>
  );
}
