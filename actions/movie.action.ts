'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

const handleError = (error) => {
  console.error(error);
  throw new Error(error.message);
};

export async function searchMovies({ searchInput, page, pageSize }) {
  const supabase = await createServerSupabaseClient();

  const { data, count, error } = await supabase
    .from('movie')
    .select('*')
    .like('title', `%${searchInput}%`)
    .range((page - 1) * pageSize, page * pageSize - 1); // 페이지네이션을 위해 범위 설정

  const hasNextPage = count > page * pageSize; // 다음 페이지가 있는지 확인

  if (error) {
    console.error(error);
    return {
      data: [],
      count: 0,
      page: null,
      pageSize: null,
      error,
    };
  }

  return {
    data,
    page,
    pageSize,
    hasNextPage,
  };
}

export async function getMovie(id) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('movie')
    .select('*')
    .eq('id', id)
    .maybeSingle(); // 데이터가 하나인건 알고 있지만, null일 수도 있으니 maybeSingle 사용

  if (error) {
    handleError(error);
  }

  return data;
}
