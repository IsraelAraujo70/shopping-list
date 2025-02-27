import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Create a new family
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return new NextResponse('Family name is required', { status: 400 });
    }

    // Create the family
    const family = await prisma.$queryRaw`
      INSERT INTO "Family" (id, name, "ownerId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${name}, ${userId}, NOW(), NOW())
      RETURNING id, name, "ownerId", "createdAt", "updatedAt"
    `;

    // Create the owner as a member
    await prisma.$queryRaw`
      INSERT INTO "FamilyMember" (id, "userId", "familyId", role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${userId}, (SELECT id FROM "Family" WHERE "ownerId" = ${userId} ORDER BY "createdAt" DESC LIMIT 1), 'owner', NOW(), NOW())
    `;

    // Get the complete family with members
    const familyWithMembers = await prisma.$queryRaw`
      SELECT f.*, 
        (SELECT json_agg(fm.*) FROM "FamilyMember" fm WHERE fm."familyId" = f.id) as members
      FROM "Family" f
      WHERE f.id = (SELECT id FROM "Family" WHERE "ownerId" = ${userId} ORDER BY "createdAt" DESC LIMIT 1)
    `;

    // Ensure familyWithMembers is an array and has at least one element
    if (Array.isArray(familyWithMembers) && familyWithMembers.length > 0) {
      return NextResponse.json(familyWithMembers[0]);
    } else {
      return NextResponse.json({ error: 'Failed to retrieve family data' }, { status: 500 });
    }
  } catch (error) {
    console.error('[FAMILY_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Get all families for the user
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get families where the user is a member
    const families = await prisma.$queryRaw`
      SELECT f.*, 
        (SELECT json_agg(fm.*) FROM "FamilyMember" fm WHERE fm."familyId" = f.id) as members,
        (SELECT json_agg(l.*) FROM "List" l WHERE l."familyId" = f.id) as lists
      FROM "Family" f
      JOIN "FamilyMember" fm ON f.id = fm."familyId"
      WHERE fm."userId" = ${userId}
    `;

    return NextResponse.json(families);
  } catch (error) {
    console.error('[FAMILY_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 