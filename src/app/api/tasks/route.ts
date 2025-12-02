import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tasks?projectId=1
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
        return NextResponse.json(
            { error: 'projectId is required' },
            { status: 400 }
        )
    }

    const tasks = await prisma.task.findMany({
        where: { projectId: Number(projectId) },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(request: NextRequest) {
    try {
        const { title, description, status, priority, projectId, userId } =
            await request.json()

        if (!title || !projectId || !userId) {
            return NextResponse.json(
                { error: 'title, projectId, userId are required' },
                { status: 400 }
            )
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'todo',
                priority: priority || 'medium',
                projectId,
                userId,
            },
        })

        return NextResponse.json(task, { status: 201 })
    } catch (error) {
        console.error('Create task error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
