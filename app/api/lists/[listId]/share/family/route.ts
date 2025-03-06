import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { familyId } = await req.json();
    if (!familyId) {
      return NextResponse.json(
        { error: 'ID da família é obrigatório' },
        { status: 400 }
      );
    }

    const listId = params.listId;

    // Verificar se a lista existe e pertence ao usuário
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        userId,
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Lista não encontrada ou você não tem permissão' },
        { status: 404 }
      );
    }

    // Verificar se a família existe e o usuário é membro
    const family = await prisma.family.findFirst({
      where: {
        id: familyId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!family) {
      return NextResponse.json(
        { error: 'Família não encontrada ou você não é membro' },
        { status: 404 }
      );
    }

    // Compartilhar a lista com todos os membros da família exceto o proprietário
    const sharePromises = family.members
      .filter(member => member.userId !== userId)
      .map(member => 
        prisma.listShare.upsert({
          where: {
            listId_userId: {
              listId,
              userId: member.userId,
            },
          },
          update: {},
          create: {
            listId,
            userId: member.userId,
          },
        })
      );

    await Promise.all(sharePromises);

    return NextResponse.json(
      { message: 'Lista compartilhada com a família com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao compartilhar lista com família:', error);
    return NextResponse.json(
      { error: 'Erro ao compartilhar lista com família' },
      { status: 500 }
    );
  }
} 