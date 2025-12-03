import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

// PUT /api/projects/:id
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { title, description } = await request.json()
        const { id } = await context.params
        const projectId = Number(id)

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.update({
            where: { id: projectId },
            data: { title, description },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error('Update project error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/projects/:id
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const projectId = Number(id)

        await prisma.project.delete({
            where: { id: projectId },
        })

        return NextResponse.json({ message: 'Deleted' })
    } catch (error) {
        console.error('Delete project error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
