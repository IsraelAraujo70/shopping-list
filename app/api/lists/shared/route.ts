import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Get all lists shared with the user
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all lists shared with the user
    const sharedLists = await prisma.$queryRaw`
      SELECT 
        ls.id as "shareId",
        ls."canEdit",
        l.id,
        l.name,
        l."userId",
        (
          SELECT json_agg(i.*)
          FROM "Item" i
          WHERE i."listId" = l.id
        ) as items
      FROM "ListShare" ls
      JOIN "List" l ON ls."listId" = l.id
      WHERE ls."userId" = ${userId}
    `;

    // Format the data for the response
    const formattedLists = Array.isArray(sharedLists) ? sharedLists.map((share: any) => ({
      id: share.id,
      name: share.name,
      userId: share.userId,
      items: share.items || [],
      shareId: share.shareId,
      canEdit: share.canEdit,
    })) : [];

    return NextResponse.json(formattedLists);
  } catch (error) {
    console.error('[SHARED_LISTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 