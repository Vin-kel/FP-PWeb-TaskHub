import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reminders?userId=1 → list semua reminder user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: Number(userId) },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(reminders);
  } catch (err) {
    console.error("Get reminders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reminders → create reminder baru
export async function POST(request: NextRequest) {
  try {
    const { title, description, dueDate, taskId, userId } =
      await request.json();

    if (!title || !dueDate || !userId) {
      return NextResponse.json(
        { error: "title, dueDate, userId are required" },
        { status: 400 }
      );
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        taskId: taskId ? Number(taskId) : null,
        userId,
      },
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (err) {
    console.error("Create reminder error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
