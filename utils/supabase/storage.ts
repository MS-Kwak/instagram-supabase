// https://uovomsxutgdnwwdxjodb.supabase.co/storage/v1/object/public/minibox//1749092884.JPG

export function getImageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

  if (!baseUrl || !bucketName) {
    throw new Error('Supabase URL or Storage Bucket is not defined');
  }

  return `${baseUrl}/storage/v1/object/public/${bucketName}/${path}`;
}
