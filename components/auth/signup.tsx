'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { Input } from '@material-tailwind/react';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

export default function SignUp({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationRequired, setConfirmationRequired] =
    useState(false);

  const supabase = createBrowserSupabaseClient();
  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `http://localhost:3000/signup/confirm`,
        },
      });
      if (data) {
        setConfirmationRequired(true);
      }

      if (error) {
        console.error('Signup error:', error);
        throw new Error(error.message);
      }
    },
  });

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center pt-10 pb-6 px-10 w-full max-w-lg border border-gray-300 bg-white">
        <Image
          src={'/inflearngram.png'}
          width={60}
          height={20}
          className="w-60 !h-auto mb-6"
          alt="logo"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          className="w-full rounded-sm mb-2 border-gray-300 p-2"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="w-full rounded-sm mb-2 border-gray-300 p-2"
        />
        <Button
          onClick={() => {
            // Handle signup logic here
            signupMutation.mutate();
          }}
          loading={signupMutation.isPending}
          disabled={confirmationRequired}
          style={{ backgroundColor: '#1877F2', color: 'white' }}
          className=" hover:bg-[#1877F2] hover:brightness-110 w-full"
        >
          {confirmationRequired
            ? `메일함을 확인해주세요`
            : `가입하기`}
        </Button>
      </div>
      <div className="py-4 w-full text-center max-w-lg text-sm border border-gray-300 bg-white">
        이미 계정이 있으신가요?
        <button
          onClick={() => setView('SIGNIN')}
          className="text-blue-500 font-bold pl-1"
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
