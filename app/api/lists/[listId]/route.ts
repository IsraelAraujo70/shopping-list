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

    // Delete all items in the list first
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
    return new NextResponse('Internal Error', { status: 500 });
  }
} 