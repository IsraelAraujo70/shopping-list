'use client';

import { useUser } from '@clerk/nextjs';

export default function UserIdDisplay() {
  const { user } = useUser();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center mr-2">
      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
        ID: {user.id}
      </span>
    </div>
  );
} 