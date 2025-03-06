import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First verify if the list belongs to the user
    const list = await prisma.list.findUnique({
      where: {
        id: params.listId,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    if (list.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete all shares first
    await prisma.$queryRaw`
      DELETE FROM "ListShare" WHERE "listId" = ${params.listId}
    `;

    // Delete all items in the list
    await prisma.item.deleteMany({
      where: {
        listId: params.listId,
      },
    });

    // Then delete the list
    await prisma.list.delete({
      where: {
        id: params.listId,
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[LIST_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

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

    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
      include: {
        items: true,
      },
    });

    if (!list) {
      return new NextResponse('List not found', { status: 404 });
    }

    // Check if the user is the owner or has shared access
    if (list.userId !== userId) {
      // Check if the user has shared access
      const share = await prisma.$queryRaw`
        SELECT * FROM "ListShare" 
        WHERE "listId" = ${listId} AND "userId" = ${userId}
      `;

      if (!share || !Array.isArray(share) || share.length === 0) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error('[LIST_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 