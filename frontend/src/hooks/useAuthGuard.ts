// hooks/useAuthGuard.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/auth/verify-token`, {
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        router.replace('/auth/signin');
      }
    });
  }, []);
}
