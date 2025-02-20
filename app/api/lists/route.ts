import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name } = await req.json();
    const list = await prisma.list.create({
      data: {
        name,
        userId,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error('[LISTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lists = await prisma.list.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error('[LISTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}