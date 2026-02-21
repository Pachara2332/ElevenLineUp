import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helper";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId: id,
        userId: user.userId,
      },
    },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.post.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      })
    ]);
    return NextResponse.json({ liked: false });
  }

  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: {
        postId: id,
        userId: user.userId,
      },
      include: {
        post: {
          select: { authorId: true },
        },
      },
    }),
    prisma.post.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    })
  ]);

  // Create Notification
  if (like.post.authorId !== user.userId) {
    const notification = await prisma.notification.create({
      data: {
        userId: like.post.authorId,
        actorId: user.userId,
        type: "LIKE",
        entityId: id,
      },
      include: {
        actor: { select: { name: true, avatar: true } },
      },
    });

    // Emit Socket Event
    const io = (global as any).io;
    if (io) {
      io.to(`user-${like.post.authorId}`).emit("notification", notification);
    }
  }

  return NextResponse.json({ liked: true });
}
