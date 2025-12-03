import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

// GET /api/projects?userId=1  → list projects milik user
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
        )
    }

    const projects = await prisma.project.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
}

// POST /api/projects  → create project baru
export async function POST(request: NextRequest) {
    try {
        const { title, description, userId } = await request.json()

        if (!title || !userId) {
            return NextResponse.json(
                { error: 'Title and userId are required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                userId,
            },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Create project error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
