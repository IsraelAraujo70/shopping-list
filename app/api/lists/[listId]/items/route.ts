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
      return new NextResponse('Não autorizado', { status: 401 });
    }

    // Verifica se a lista pertence ao usuário
    const list = await prisma.list.findUnique({
      where: {
        id: params.listId,
      },
    });

    if (!list) {
      return new NextResponse('Lista não encontrada', { status: 404 });
    }

    if (list.userId !== userId) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const { name, estimatedPrice } = await req.json();

    const item = await prisma.item.create({
      data: {
        name,
        estimatedPrice,
        listId: params.listId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('[ITEMS_POST]', error);
    return new NextResponse('Erro interno', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    const { itemId, completed } = await req.json();

    // Verifica se a lista pertence ao usuário
    const list = await prisma.list.findUnique({
      where: {
        id: params.listId,
      },
    });

    if (!list) {
      return new NextResponse('Lista não encontrada', { status: 404 });
    }

    if (list.userId !== userId) {
      return new NextResponse('Não autorizado', { status: 401 });
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
    return new NextResponse('Erro interno', { status: 500 });
  }
} 