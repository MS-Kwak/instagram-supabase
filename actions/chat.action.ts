'use server';

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from '@/utils/supabase/server';

export async function getAllUsers() {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data?.users;
}

export async function getUserById(userId) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(
    userId
  );

  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
  return data.user;
}

export async function sendMessage({ message, chatUserId }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    console.error('Error fetching session:', error);
    throw new Error('User is not authenticated');
  }

  const { data, error: sendMessageError } = await supabase
    .from('message')
    .insert({
      message,
      receiver: chatUserId,
      sender: session.user.id,
    });

  if (sendMessageError) {
    console.error('Error sending message:', sendMessageError);
    throw new Error('Failed to send message');
  }

  return data;
}

export async function getAllMessages({ chatUserId }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    console.error('Error fetching session:', error);
    throw new Error('User is not authenticated');
  }

  const { data, error: getMessagesError } = await supabase
    .from('message')
    .select('*')
    .or(`receiver.eq.${chatUserId}, receiver.eq.${session.user.id}`)
    .or(`sender.eq.${chatUserId}, sender.eq.${session.user.id}`)
    .order('created_at', { ascending: true });
  // .or().or()이면 .or() && .or()로 묶여서 처리됨

  if (getMessagesError) {
    return [];
  }

  return data;
}
