'use client';

import React from 'react';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import Loader from '../../components/feedback/loader/Loader';

export default function AuthGuard({redirectedTo, children }: { children: React.ReactNode, redirectedTo?: string }) {
  const isVerified = useAuthGuard({ redirectTo: redirectedTo });

  if (isVerified === null) {
    return <Loader />;
  }

  if (!isVerified) return null;

  return <>{children}</>;
}
