import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tags?userId=1 → list semua tags user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: { userId: Number(userId) },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (err) {
    console.error("Get tags error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tags → create tag baru
export async function POST(request: NextRequest) {
  try {
    const { name, color, userId } = await request.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: "name, userId are required" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || "#3B82F6",
        userId,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (err) {
    console.error("Create tag error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
