import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Share a list with a user
export async function POST(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const listId = params.listId;
    const { targetUserId, canEdit = true } = await req.json();

    if (!targetUserId) {
      return new NextResponse('Target user ID is required', { status: 400 });
    }

    // Check if the list belongs to the user
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    if (list.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the list is already shared with the user
    const existingShareResult = await prisma.$queryRaw`
      SELECT * FROM "ListShare" 
      WHERE "listId" = ${listId} AND "userId" = ${targetUserId}
    `;

    if (Array.isArray(existingShareResult) && existingShareResult.length > 0) {
      // Update the existing share
      const updatedShareResult = await prisma.$queryRaw`
        UPDATE "ListShare" 
        SET "canEdit" = ${canEdit}, "updatedAt" = NOW()
        WHERE "listId" = ${listId} AND "userId" = ${targetUserId}
        RETURNING *
      `;
      
      if (Array.isArray(updatedShareResult) && updatedShareResult.length > 0) {
        return NextResponse.json(updatedShareResult[0]);
      } else {
        return NextResponse.json({ error: 'Failed to update share' }, { status: 500 });
      }
    }

    // Create a new share
    const shareResult = await prisma.$queryRaw`
      INSERT INTO "ListShare" (id, "listId", "userId", "canEdit", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${listId}, ${targetUserId}, ${canEdit}, NOW(), NOW())
      RETURNING *
    `;

    if (Array.isArray(shareResult) && shareResult.length > 0) {
      return NextResponse.json(shareResult[0]);
    } else {
      return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
    }
  } catch (error) {
    console.error('[LIST_SHARE_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Get all shares for a list
export async function GET(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const listId = params.listId;

    // Check if the list belongs to the user
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    if (list.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all shares for the list
    const shares = await prisma.$queryRaw`
      SELECT * FROM "ListShare" WHERE "listId" = ${listId}
    `;

    return NextResponse.json(shares);
  } catch (error) {
    console.error('[LIST_SHARES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Remove a share
export async function DELETE(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const listId = params.listId;
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return new NextResponse('Target user ID is required', { status: 400 });
    }

    // Check if the list belongs to the user
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    if (list.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete the share
    await prisma.$queryRaw`
      DELETE FROM "ListShare" 
      WHERE "listId" = ${listId} AND "userId" = ${targetUserId}
    `;

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[LIST_SHARE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 