"use client";

import { UserButton } from '@clerk/nextjs';

interface UserButtonClientProps {
  afterSignOutUrl?: string;
}

export default function UserButtonClient({ afterSignOutUrl = "/" }: UserButtonClientProps) {
  return <UserButton afterSignOutUrl={afterSignOutUrl} />;
} 