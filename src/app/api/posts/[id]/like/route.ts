
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helper';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // const { userId } = await req.json(); // Legacy: Client used to send userId
    const userId = user.userId;
    const postId = params.id;

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId
            }
        }
    });

    if (existingLike) {
        // Unlike
        await prisma.like.delete({
            where: {
                id: existingLike.id
            }
        });
        return NextResponse.json({ liked: false });
    } else {
        // Like
        await prisma.like.create({
            data: {
                postId,
                userId
            }
        });
        return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
