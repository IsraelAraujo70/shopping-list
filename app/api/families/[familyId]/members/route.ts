import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Add a member to a family
export async function POST(
  req: Request,
  { params }: { params: { familyId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const familyId = params.familyId;
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Check if the family exists and the user is the owner
    const familyResult = await prisma.$queryRaw`
      SELECT * FROM "Family" WHERE id = ${familyId}
    `;

    // Ensure family is an array and has at least one element
    if (!Array.isArray(familyResult) || familyResult.length === 0) {
      return new NextResponse('Family not found', { status: 404 });
    }

    const familyData = familyResult[0] as { ownerId: string };
    if (familyData.ownerId !== userId) {
      return new NextResponse('Only the family owner can add members', { status: 403 });
    }

    // Check if the user is already a member
    const existingMemberResult = await prisma.$queryRaw`
      SELECT * FROM "FamilyMember" 
      WHERE "familyId" = ${familyId} AND "userId" = ${targetUserId}
    `;

    // Check if the user is already a member
    if (Array.isArray(existingMemberResult) && existingMemberResult.length > 0) {
      return new NextResponse('User is already a member of this family', { status: 400 });
    }

    // Add the user as a member
    const memberResult = await prisma.$queryRaw`
      INSERT INTO "FamilyMember" (id, "userId", "familyId", role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${targetUserId}, ${familyId}, 'member', NOW(), NOW())
      RETURNING id, "userId", "familyId", role, "createdAt", "updatedAt"
    `;

    // Ensure member is an array and has at least one element
    if (Array.isArray(memberResult) && memberResult.length > 0) {
      return NextResponse.json(memberResult[0]);
    } else {
      return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
    }
  } catch (error) {
    console.error('[FAMILY_MEMBER_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Get all members of a family
export async function GET(
  req: Request,
  { params }: { params: { familyId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const familyId = params.familyId;

    // Check if the family exists and the user is a member
    const userMembershipResult = await prisma.$queryRaw`
      SELECT * FROM "FamilyMember" 
      WHERE "familyId" = ${familyId} AND "userId" = ${userId}
    `;

    // Ensure userMembership is an array and has at least one element
    if (!Array.isArray(userMembershipResult) || userMembershipResult.length === 0) {
      return new NextResponse('You are not a member of this family', { status: 403 });
    }

    // Get all members of the family
    const members = await prisma.$queryRaw`
      SELECT * FROM "FamilyMember" WHERE "familyId" = ${familyId}
    `;

    return NextResponse.json(members);
  } catch (error) {
    console.error('[FAMILY_MEMBERS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Remove a member from a family
export async function DELETE(
  req: Request,
  { params }: { params: { familyId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const familyId = params.familyId;
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Check if the family exists and the user is the owner
    const familyResult = await prisma.$queryRaw`
      SELECT * FROM "Family" WHERE id = ${familyId}
    `;

    // Ensure family is an array and has at least one element
    if (!Array.isArray(familyResult) || familyResult.length === 0) {
      return new NextResponse('Family not found', { status: 404 });
    }

    const familyData = familyResult[0] as { ownerId: string };
    if (familyData.ownerId !== userId) {
      return new NextResponse('Only the family owner can remove members', { status: 403 });
    }

    // Check if the target user is the owner
    if (targetUserId === familyData.ownerId) {
      return new NextResponse('Cannot remove the family owner', { status: 400 });
    }

    // Check if the user is a member
    const existingMemberResult = await prisma.$queryRaw`
      SELECT * FROM "FamilyMember" 
      WHERE "familyId" = ${familyId} AND "userId" = ${targetUserId}
    `;

    // Ensure existingMember is an array and has at least one element
    if (!Array.isArray(existingMemberResult) || existingMemberResult.length === 0) {
      return new NextResponse('User is not a member of this family', { status: 404 });
    }

    // Remove the member
    await prisma.$queryRaw`
      DELETE FROM "FamilyMember" 
      WHERE "familyId" = ${familyId} AND "userId" = ${targetUserId}
    `;

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[FAMILY_MEMBER_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 