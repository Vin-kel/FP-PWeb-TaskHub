import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/reminders/:id → update reminder
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const reminderId = Number(id);

    // Convert dueDate jika ada
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate);
    }

    const reminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: body,
    });

    return NextResponse.json(reminder);
  } catch (err) {
    console.error("Update reminder error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders/:id → delete reminder
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const reminderId = Number(id);

    await prisma.reminder.delete({
      where: { id: reminderId },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete reminder error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
