import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

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
    const { name, estimatedPrice, quantity } = await req.json();

    // Check if the list belongs to the user or if the user has shared access
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    // If the user is not the owner, check if they have shared access
    if (list.userId !== userId) {
      const share = await prisma.$queryRaw`
        SELECT * FROM "ListShare" 
        WHERE "listId" = ${listId} AND "userId" = ${userId}
      `;

      if (!share || !Array.isArray(share) || share.length === 0) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      // Check if the user has permission to edit
      if (!share[0].canEdit) {
        return new NextResponse('You do not have permission to add items to this list', { status: 403 });
      }
    }

    const item = await prisma.item.create({
      data: {
        name,
        estimatedPrice,
        quantity: quantity || 1,
        listId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('[ITEMS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const listId = params.listId;
    const { itemId, completed } = await req.json();

    // Check if the list belongs to the user or if the user has shared access
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    // If the user is not the owner, check if they have shared access
    if (list.userId !== userId) {
      const share = await prisma.$queryRaw`
        SELECT * FROM "ListShare" 
        WHERE "listId" = ${listId} AND "userId" = ${userId}
      `;

      if (!share || !Array.isArray(share) || share.length === 0) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      // Check if the user has permission to edit
      if (!share[0].canEdit) {
        return new NextResponse('You do not have permission to update items in this list', { status: 403 });
      }
    }

    const item = await prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        completed,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('[ITEMS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 