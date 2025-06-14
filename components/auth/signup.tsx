'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { Input } from '@material-tailwind/react';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

export default function SignUp({ setView }) {
  const [otp, setOtp] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationRequired, setConfirmationRequired] =
    useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const supabase = createBrowserSupabaseClient();
  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${BASE_URL}/signup/confirm`,
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

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });
      if (data) {
        console.log('OTP verification successful:', data);
      }

      if (error) {
        console.error('Signup error:', error);
        throw new Error(error.message);
      }
    },
  });

  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
          : 'http://localhost:3000/auth/callback',
      },
    });
    if (data) {
      console.log('Kakao sign-in initiated:', data);
    }
    if (error) {
      console.error('Kakao sign-in error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <div className="flex flex-col gap-2 items-center justify-center pt-10 pb-6 px-10 w-full max-w-lg border border-gray-300 bg-white">
        <Image
          src={'/inflearngram.png'}
          width={60}
          height={20}
          className="w-60 !h-auto mb-6"
          alt="logo"
        />

        {confirmationRequired ? (
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6자리 OTP를 입력해주세요"
            type="text"
            className="w-full rounded-sm border-gray-300 p-2"
          />
        ) : (
          <>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              type="email"
              className="w-full rounded-sm border-gray-300 p-2"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              className="w-full rounded-sm border-gray-300 p-2"
            />
          </>
        )}

        <Button
          onClick={() => {
            // Handle signup logic here
            if (confirmationRequired) {
              verifyOtpMutation.mutate();
            } else {
              signupMutation.mutate();
            }
          }}
          loading={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          disabled={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          style={{ backgroundColor: '#1877F2', color: 'white' }}
          className=" hover:bg-[#1877F2] hover:brightness-110 w-full"
        >
          {confirmationRequired ? `인증하기` : `가입하기`}
        </Button>

        <Button
          onClick={() => {
            signInWithKakao();
          }}
          style={{ backgroundColor: '#f2d918', color: 'black' }}
          className=" hover:bg-[#f2d918] hover:brightness-110 w-full"
        >
          Kakao 로그인
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
