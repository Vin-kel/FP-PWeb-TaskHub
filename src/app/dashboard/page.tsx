'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: number
    name: string
    email: string
}

interface Project {
    id: number
    title: string
    description: string | null
    createdAt: string
}

interface Task {
    id: number
    title: string
    description: string | null
    status: string
    priority: string
    projectId: number
    createdAt: string
}

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    const [projects, setProjects] = useState<Project[]>([])
    const [projectsLoaded, setProjectsLoaded] = useState(false)
    const [loadingProjects, setLoadingProjects] = useState(false)

    const [tasksByProject, setTasksByProject] = useState<Record<number, Task[]>>(
        {}
    )
    const [loadingTasks, setLoadingTasks] = useState<Record<number, boolean>>({})
    const [openProjectIds, setOpenProjectIds] = useState<Set<number>>(
        () => new Set()
    )

    const [creatingProject, setCreatingProject] = useState(false)
    const [error, setError] = useState('')
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
    })

    const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
    const [editProject, setEditProject] = useState({
        title: '',
        description: '',
    })

    const [newTaskTitle, setNewTaskTitle] = useState<Record<number, string>>({})
    const [newTaskDescription, setNewTaskDescription] = useState<
        Record<number, string>
    >({})

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
    const [editTaskData, setEditTaskData] = useState<{
        title: string
        description: string
    }>({
        title: '',
        description: '',
    })

    // hanya cek user saat mount
    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (!userData) {
            router.push('/auth/login')
            return
        }

        const parsed: User = JSON.parse(userData)
        setUser(parsed)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/')
    }

    // READ PROJECTS: dipanggil saat klik "Load Projects"
    const loadProjects = async () => {
        if (!user) return
        setLoadingProjects(true)
        setError('')

        try {
            const res = await fetch(`/api/projects?userId=${user.id}`)
            const raw = (await res.json()) as any

            if (!res.ok) {
                setError(raw?.error || 'Failed to load projects')
                return
            }

            setProjects(raw as Project[])
            setProjectsLoaded(true)
            setOpenProjectIds(new Set())
            setTasksByProject({})
        } catch {
            setError('An error occurred while loading projects')
        } finally {
            setLoadingProjects(false)
        }
    }

    // READ TASKS per project: saat klik Show Tasks pertama kali
    const loadTasksForProject = async (projectId: number) => {
        setLoadingTasks((prev) => ({ ...prev, [projectId]: true }))
        setError('')

        try {
            const res = await fetch(`/api/tasks?projectId=${projectId}`)
            const raw = (await res.json()) as any

            if (!res.ok) {
                setError(raw?.error || 'Failed to load tasks')
                return
            }

            setTasksByProject((prev) => ({
                ...prev,
                [projectId]: raw as Task[],
            }))
        } catch {
            setError('An error occurred while loading tasks')
        } finally {
            setLoadingTasks((prev) => ({ ...prev, [projectId]: false }))
        }
    }

    const toggleProjectOpen = async (projectId: number) => {
        const newSet = new Set(openProjectIds)
        const isOpen = newSet.has(projectId)

        if (isOpen) {
            newSet.delete(projectId)
            setOpenProjectIds(newSet)
            return
        }

        newSet.add(projectId)
        setOpenProjectIds(newSet)

        if (!tasksByProject[projectId]) {
            await loadTasksForProject(projectId)
        }
    }

    // CREATE PROJECT
    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setCreatingProject(true)
        setError('')

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newProject.title,
                    description: newProject.description,
                    userId: user.id,
                }),
            })

            const raw = (await res.json()) as any

            if (!res.ok) {
                setError(raw?.error || 'Failed to create project')
                return
            }

            setNewProject({ title: '', description: '' })
            await loadProjects()
        } catch {
            setError('An error occurred')
        } finally {
            setCreatingProject(false)
        }
    }

    const startEditProject = (project: Project) => {
        setEditingProjectId(project.id)
        setEditProject({
            title: project.title,
            description: project.description || '',
        })
    }

    const cancelEditProject = () => {
        setEditingProjectId(null)
        setEditProject({ title: '', description: '' })
    }

    const handleUpdateProject = async (e: React.FormEvent, id: number) => {
        e.preventDefault()
        if (!user) return

        setError('')

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editProject),
            })

            const raw = (await res.json()) as any

            if (!res.ok) {
                setError(raw?.error || 'Failed to update project')
                return
            }

            cancelEditProject()
            await loadProjects()
        } catch {
            setError('An error occurred')
        }
    }

    const handleDeleteProject = async (id: number) => {
        if (!user) return
        if (!confirm('Delete this project?')) return

        setError('')

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            })

            const raw = (await res.json()) as any
            if (!res.ok) {
                setError(raw?.error || 'Failed to delete project')
                return
            }

            await loadProjects()
        } catch {
            setError('An error occurred')
        }
    }

    // CREATE TASK
    const handleCreateTask = async (projectId: number) => {
        if (!user) return
        const title = newTaskTitle[projectId]?.trim()
        const description = newTaskDescription[projectId]?.trim() || ''

        if (!title) return

        setError('')

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    projectId,
                    userId: user.id,
                }),
            })

            const raw = (await res.json()) as any

            if (!res.ok) {
                setError(raw?.error || 'Failed to create task')
                return
            }

            setNewTaskTitle((prev) => ({ ...prev, [projectId]: '' }))
            setNewTaskDescription((prev) => ({ ...prev, [projectId]: '' }))

            await loadTasksForProject(projectId)
        } catch {
            setError('An error occurred')
        }
    }

    const toggleTaskStatus = async (task: Task) => {
        const newStatus =
            task.status === 'todo'
                ? 'in_progress'
                : task.status === 'in_progress'
                    ? 'done'
                    : 'todo'

        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            const raw = (await res.json()) as any
            if (!res.ok) {
                setError(raw?.error || 'Failed to update task')
                return
            }

            await loadTasksForProject(task.projectId)
        } catch {
            setError('An error occurred')
        }
    }

    const handleDeleteTask = async (task: Task) => {
        if (!confirm('Delete this task?')) return

        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: 'DELETE',
            })

            const raw = (await res.json()) as any
            if (!res.ok) {
                setError(raw?.error || 'Failed to delete task')
                return
            }

            await loadTasksForProject(task.projectId)
        } catch {
            setError('An error occurred')
        }
    }

    const startEditTask = (task: Task) => {
        setEditingTaskId(task.id)
        setEditTaskData({
            title: task.title,
            description: task.description || '',
        })
    }

    const cancelEditTask = () => {
        setEditingTaskId(null)
        setEditTaskData({ title: '', description: '' })
    }

    const handleUpdateTask = async (e: React.FormEvent, task: Task) => {
        e.preventDefault()

        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editTaskData),
            })

            const raw = (await res.json()) as any
            if (!res.ok) {
                setError(raw?.error || 'Failed to update task')
                return
            }

            await loadTasksForProject(task.projectId)
            cancelEditTask()
        } catch {
            setError('An error occurred')
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Checking session...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
                        <p className="text-sm text-gray-600">Welcome, {user.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <section className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                        <button
                            type="button"
                            onClick={loadProjects}
                            disabled={loadingProjects}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loadingProjects ? 'Loading...' : 'Load Projects'}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                            {error}
                        </div>
                    )}

                    {/* Create Project Form */}
                    <form onSubmit={handleCreateProject} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={newProject.title}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, title: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={newProject.description}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, description: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={creatingProject}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {creatingProject ? 'Creating...' : 'Create Project'}
                        </button>
                    </form>

                    {/* Projects list */}
                    {!projectsLoaded ? (
                        <p className="text-gray-500 text-sm">
                            Click &ldquo;Load Projects&rdquo; to display your projects.
                        </p>
                    ) : projects.length === 0 ? (
                        <p className="text-gray-500">No projects yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projects.map((project) => {
                                const isOpen = openProjectIds.has(project.id)
                                const projectTasks = tasksByProject[project.id] || []
                                const isLoadingTasks = loadingTasks[project.id]

                                return (
                                    <div
                                        key={project.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition space-y-4"
                                    >
                                        {editingProjectId === project.id ? (
                                            <form
                                                onSubmit={(e) => handleUpdateProject(e, project.id)}
                                                className="space-y-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={editProject.title}
                                                    onChange={(e) =>
                                                        setEditProject({
                                                            ...editProject,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    required
                                                />
                                                <textarea
                                                    value={editProject.description}
                                                    onChange={(e) =>
                                                        setEditProject({
                                                            ...editProject,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditProject}
                                                        className="px-3 py-1 rounded border border-gray-300 text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 rounded bg-blue-600 text-white"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {project.title}
                                                    </h3>
                                                    {project.description && (
                                                        <p className="text-gray-600 mt-1">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Created at{' '}
                                                        {new Date(project.createdAt).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 mt-1 justify-between items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleProjectOpen(project.id)}
                                                        className="text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        {isOpen ? 'Hide Tasks' : 'Show Tasks'}
                                                    </button>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEditProject(project)}
                                                            className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                                                            type="button"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProject(project.id)}
                                                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
                                                            type="button"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {isOpen && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                                    Tasks
                                                </h4>

                                                {isLoadingTasks ? (
                                                    <p className="text-xs text-gray-400">
                                                        Loading tasks...
                                                    </p>
                                                ) : (
                                                    <>
                                                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                                                            {projectTasks.length === 0 ? (
                                                                <p className="text-xs text-gray-400">
                                                                    No tasks yet. Add one below.
                                                                </p>
                                                            ) : (
                                                                projectTasks.map((task) => (
                                                                    <div
                                                                        key={task.id}
                                                                        className="border border-gray-200 rounded px-2 py-1"
                                                                    >
                                                                        {editingTaskId === task.id ? (
                                                                            <form
                                                                                onSubmit={(e) => handleUpdateTask(e, task)}
                                                                                className="space-y-1"
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    value={editTaskData.title}
                                                                                    onChange={(e) =>
                                                                                        setEditTaskData((prev) => ({
                                                                                            ...prev,
                                                                                            title: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                                                    required
                                                                                />
                                                                                <textarea
                                                                                    value={editTaskData.description}
                                                                                    onChange={(e) =>
                                                                                        setEditTaskData((prev) => ({
                                                                                            ...prev,
                                                                                            description: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                                                                    rows={2}
                                                                                />
                                                                                <div className="flex justify-end gap-2 mt-1">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={cancelEditTask}
                                                                                        className="text-xs px-2 py-0.5 border border-gray-300 rounded"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button
                                                                                        type="submit"
                                                                                        className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded"
                                                                                    >
                                                                                        Save
                                                                                    </button>
                                                                                </div>
                                                                            </form>
                                                                        ) : (
                                                                            <div className="flex items-start justify-between gap-2">
                                                                                <div>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => toggleTaskStatus(task)}
                                                                                        className={`text-xs px-2 py-0.5 rounded mb-1 ${task.status === 'todo'
                                                                                                ? 'bg-gray-100 text-gray-700'
                                                                                                : task.status === 'in_progress'
                                                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                                                    : 'bg-green-100 text-green-800'
                                                                                            }`}
                                                                                    >
                                                                                        {task.status}
                                                                                    </button>
                                                                                    <div className="text-sm font-medium text-gray-900">
                                                                                        {task.title}
                                                                                    </div>
                                                                                    {task.description && (
                                                                                        <div className="text-xs text-gray-600">
                                                                                            {task.description}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex flex-col items-end gap-1">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => startEditTask(task)}
                                                                                        className="text-xs text-blue-600 hover:text-blue-800"
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleDeleteTask(task)}
                                                                                        className="text-xs text-red-600 hover:text-red-800"
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>

                                                        {/* New task form */}
                                                        <div className="space-y-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Task title"
                                                                value={newTaskTitle[project.id] || ''}
                                                                onChange={(e) =>
                                                                    setNewTaskTitle((prev) => ({
                                                                        ...prev,
                                                                        [project.id]: e.target.value,
                                                                    }))
                                                                }
                                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                            />
                                                            <textarea
                                                                placeholder="Description (optional)"
                                                                value={newTaskDescription[project.id] || ''}
                                                                onChange={(e) =>
                                                                    setNewTaskDescription((prev) => ({
                                                                        ...prev,
                                                                        [project.id]: e.target.value,
                                                                    }))
                                                                }
                                                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                                                rows={2}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCreateTask(project.id)}
                                                                className="mt-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                            >
                                                                Add Task
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
