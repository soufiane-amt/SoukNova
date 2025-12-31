'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER}/auth/verify-token`,
          {
            credentials: 'include',
          },
        );
        if (!mounted) return;
        if (!res.ok) {
          setIsVerified(false);
          router.replace('/auth/signin');
          return;
        }
        setIsVerified(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (!mounted) return;
        setIsVerified(false);
        router.replace('/auth/signin');
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [router]);

  return isVerified;
}
