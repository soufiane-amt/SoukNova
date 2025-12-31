'use client';

import React from 'react';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import Loader from '../../components/feedback/loader/Loader';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isVerified = useAuthGuard();

  if (isVerified === null) {
    return <Loader />;
  }

  if (!isVerified) return null;

  return <>{children}</>;
}
