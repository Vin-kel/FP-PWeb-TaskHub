import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

// PUT /api/tasks/:id
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json()
        const { id } = await context.params
        const taskId = Number(id)

        const task = await prisma.task.update({
            where: { id: taskId },
            data: body,
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error('Update task error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/tasks/:id
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const taskId = Number(id)

        await prisma.task.delete({
            where: { id: taskId },
        })

        return NextResponse.json({ message: 'Deleted' })
    } catch (error) {
        console.error('Delete task error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
