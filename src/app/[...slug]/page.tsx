'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import HomePage from '../page';

export default function CatchAllPage() {
  const params = useParams();
  return <HomePage />;
}
