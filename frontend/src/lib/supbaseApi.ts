const SUPABASE_URL = 'https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd2NqY21kY2ZpdG5uc3Fmb2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTI3MTksImV4cCI6MjA0NjM4ODcxOX0.bx4a1dNx8g-BZX2KWceWBuRlPwAqgxhZ80i7L4K8M7Y';
export async function fetchFromSupabase<T>(
  endpoint: string,
  query: string,
): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/${endpoint}?${query}`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }

  return response.json();
}
