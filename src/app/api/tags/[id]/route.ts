import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/tags/:id → update tag
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const tagId = Number(id);

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: body,
    });

    return NextResponse.json(tag);
  } catch (err) {
    console.error("Update tag error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/:id → delete tag
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tagId = Number(id);

    await prisma.tag.delete({
      where: { id: tagId },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete tag error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
