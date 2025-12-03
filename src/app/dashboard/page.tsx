"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  projectId: number;
  createdAt: string;
}

interface Reminder {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  taskId: number | null;
  createdAt: string;
}

interface Tag {
  id: number;
  name: string;
  color: string | null;
  userId: number;
  _count?: {
    tasks: number;
  };
}

interface ApiResponse<T> {
  error?: string;
  [key: string]: unknown;
  data?: T;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Tasks state
  const [tasksByProject, setTasksByProject] = useState<Record<number, Task[]>>(
    {}
  );
  const [loadingTasks, setLoadingTasks] = useState<Record<number, boolean>>({});
  const [openProjectIds, setOpenProjectIds] = useState<Set<number>>(
    () => new Set()
  );

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [remindersLoaded, setRemindersLoaded] = useState(false);

  // Tags state
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);

  // Form states
  const [creatingProject, setCreatingProject] = useState(false);
  const [error, setError] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  // New Reminder form
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [creatingReminder, setCreatingReminder] = useState(false);

  // New Tag form
  const [newTag, setNewTag] = useState({ name: "", color: "#3B82F6" });
  const [creatingTag, setCreatingTag] = useState(false);

  // Check user session
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    const parsed: User = JSON.parse(userData);
    setUser(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // ========== PROJECTS ==========
  const loadProjects = async () => {
    if (!user) return;
    setLoadingProjects(true);
    setError("");

    try {
      const res = await fetch(`/api/projects?userId=${user.id}`);
      const data: ApiResponse<Project[]> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load projects");
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
      setProjectsLoaded(true);
      setOpenProjectIds(new Set());
      setTasksByProject({});
    } catch (err) {
      setError("An error occurred while loading projects");
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadTasksForProject = async (projectId: number) => {
    setLoadingTasks((prev) => ({ ...prev, [projectId]: true }));
    setError("");

    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      const data: ApiResponse<Task[]> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load tasks");
        return;
      }

      setTasksByProject((prev) => ({
        ...prev,
        [projectId]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      setError("An error occurred while loading tasks");
      console.error(err);
    } finally {
      setLoadingTasks((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const toggleProjectOpen = async (projectId: number) => {
    const newSet = new Set(openProjectIds);
    const isOpen = newSet.has(projectId);

    if (isOpen) {
      newSet.delete(projectId);
      setOpenProjectIds(newSet);
      return;
    }

    newSet.add(projectId);
    setOpenProjectIds(newSet);

    if (!tasksByProject[projectId]) {
      await loadTasksForProject(projectId);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreatingProject(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          userId: user.id,
        }),
      });

      const data: ApiResponse<Project> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to create project");
        return;
      }

      setNewProject({ title: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    setError("");

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data: ApiResponse<unknown> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to delete project");
        return;
      }

      await loadProjects();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  // ========== REMINDERS ==========
  const loadReminders = async () => {
    if (!user) return;
    setLoadingReminders(true);
    setError("");

    try {
      const res = await fetch(`/api/reminders?userId=${user.id}`);
      const data: ApiResponse<Reminder[]> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load reminders");
        return;
      }

      setReminders(Array.isArray(data) ? data : []);
      setRemindersLoaded(true);
    } catch (err) {
      setError("An error occurred while loading reminders");
      console.error(err);
    } finally {
      setLoadingReminders(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReminder.title || !newReminder.dueDate) return;

    setCreatingReminder(true);
    setError("");

    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newReminder.title,
          description: newReminder.description,
          dueDate: new Date(newReminder.dueDate).toISOString(),
          userId: user.id,
        }),
      });

      const data: ApiResponse<Reminder> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to create reminder");
        return;
      }

      setNewReminder({ title: "", description: "", dueDate: "" });
      await loadReminders();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setCreatingReminder(false);
    }
  };

  const handleDeleteReminder = async (id: number) => {
    if (!confirm("Delete this reminder?")) return;

    try {
      const res = await fetch(`/api/reminders/${id}`, { method: "DELETE" });
      const data: ApiResponse<unknown> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to delete reminder");
        return;
      }

      await loadReminders();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  // ========== TAGS ==========
  const loadTags = async () => {
    if (!user) return;
    setLoadingTags(true);
    setError("");

    try {
      const res = await fetch(`/api/tags?userId=${user.id}`);
      const data: ApiResponse<Tag[]> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load tags");
        return;
      }

      setTags(Array.isArray(data) ? data : []);
      setTagsLoaded(true);
    } catch (err) {
      setError("An error occurred while loading tags");
      console.error(err);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTag.name) return;

    setCreatingTag(true);
    setError("");

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTag.name,
          color: newTag.color,
          userId: user.id,
        }),
      });

      const data: ApiResponse<Tag> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to create tag");
        return;
      }

      setNewTag({ name: "", color: "#3B82F6" });
      await loadTags();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setCreatingTag(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm("Delete this tag?")) return;

    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      const data: ApiResponse<unknown> = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to delete tag");
        return;
      }

      await loadTags();
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
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

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* PROJECTS SECTION */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            <button
              onClick={loadProjects}
              disabled={loadingProjects}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingProjects ? "Loading..." : "Load Projects"}
            </button>
          </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={creatingProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creatingProject ? "Creating..." : "Create Project"}
            </button>
          </form>

          {!projectsLoaded ? (
            <p className="text-gray-500 text-sm">
              Click Load Projects to display your projects.
            </p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => {
                const isOpen = openProjectIds.has(project.id);
                const projectTasks = tasksByProject[project.id] || [];

                return (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3 justify-between">
                      <button
                        onClick={() => toggleProjectOpen(project.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {isOpen ? "Hide Tasks" : "Show Tasks"}
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          Tasks
                        </h4>
                        {projectTasks.length === 0 ? (
                          <p className="text-xs text-gray-400">No tasks yet.</p>
                        ) : (
                          <div className="space-y-2 mb-3">
                            {projectTasks.map((task) => (
                              <div
                                key={task.id}
                                className="border border-gray-200 rounded px-2 py-1"
                              >
                                <div className="text-sm font-medium text-gray-900">
                                  {task.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {task.description}
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteProject(project.id)
                                  }
                                  className="text-xs text-red-600 hover:text-red-800 mt-1"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* REMINDERS SECTION */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Reminders</h2>
            <button
              onClick={loadReminders}
              disabled={loadingReminders}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingReminders ? "Loading..." : "Load Reminders"}
            </button>
          </div>

          <form onSubmit={handleCreateReminder} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newReminder.description}
                onChange={(e) =>
                  setNewReminder({
                    ...newReminder,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={newReminder.dueDate}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, dueDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creatingReminder}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creatingReminder ? "Creating..." : "Create Reminder"}
            </button>
          </form>

          {!remindersLoaded ? (
            <p className="text-gray-500 text-sm">
              Click Load Reminders to display your reminders.
            </p>
          ) : reminders.length === 0 ? (
            <p className="text-gray-500">No reminders yet.</p>
          ) : (
            <div className="space-y-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {reminder.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        Due: {new Date(reminder.dueDate).toLocaleString()}
                      </div>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                          reminder.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : reminder.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reminder.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-sm px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* TAGS SECTION */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tags</h2>
            <button
              onClick={loadTags}
              disabled={loadingTags}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingTags ? "Loading..." : "Load Tags"}
            </button>
          </div>

          <form onSubmit={handleCreateTag} className="space-y-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) =>
                    setNewTag({ ...newTag, name: e.target.value })
                  }
                  placeholder="e.g., urgent, frontend, bug"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={newTag.color}
                  onChange={(e) =>
                    setNewTag({ ...newTag, color: e.target.value })
                  }
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creatingTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creatingTag ? "Creating..." : "Create Tag"}
            </button>
          </form>

          {!tagsLoaded ? (
            <p className="text-gray-500 text-sm">
              Click Load Tags to display your tags.
            </p>
          ) : tags.length === 0 ? (
            <p className="text-gray-500">No tags yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : "#E5E7EB20",
                    borderColor: tag.color || "#E5E7EB",
                  }}
                  className="border px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span
                    style={{ color: tag.color || "#6B7280" }}
                    className="text-sm font-medium"
                  >
                    {tag.name}
                  </span>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
