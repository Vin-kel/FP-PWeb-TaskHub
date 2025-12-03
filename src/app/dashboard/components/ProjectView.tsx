"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react";
import type { Project, Task, Tag, Reminder } from "../page";
import { TaskItem } from "./TaskItem";

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  tags: Tag[];
  reminders: Reminder[];
  onAddProject: (title: string, description: string) => void;
  onUpdateProject: (id: string, title: string, description: string) => void;
  onDeleteProject: (id: string) => void;
  onAddTask: (projectId: string, title: string, description: string) => void;
  onUpdateTask: (id: string, title: string, description: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTagToTask: (taskId: string, tagId: string) => void;
  onRemoveTagFromTask: (taskId: string, tagId: string) => void;
  onAddReminder: (
    taskId: string,
    title: string,
    description: string,
    dueDate: string
  ) => void;
  onUpdateReminder: (
    id: string,
    title: string,
    description: string,
    dueDate: string
  ) => void;
  onDeleteReminder: (id: string) => void;
}

export function ProjectsView({
  projects,
  tasks,
  tags,
  reminders,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onAddTagToTask,
  onRemoveTagFromTask,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
}: ProjectsViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddProject(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      setShowCreateForm(false);
    }
  };

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const startEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description);
  };

  const saveEdit = () => {
    if (editingProject && editTitle.trim()) {
      onUpdateProject(editingProject, editTitle.trim(), editDescription.trim());
      setEditingProject(null);
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2>Projects</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-gray-900 mb-4">Create New Project</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project title..."
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter project description..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setTitle("");
                      setDescription("");
                    }}
                    className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">
              No projects yet. Create your first project above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const projectTasks = tasks.filter(
                (t) => t.projectId === project.id
              );
              const isExpanded = expandedProjects.has(project.id);
              const isEditing = editingProject === project.id;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleProject(project.id)}
                            className="mt-1 text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 mb-1">
                              {project.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {project.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {projectTasks.length} task
                              {projectTasks.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(project)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(project.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-gray-50">
                      <TaskList
                        projectId={project.id}
                        projectName={project.title}
                        tasks={projectTasks}
                        tags={tags}
                        reminders={reminders}
                        onAddTask={onAddTask}
                        onUpdateTask={onUpdateTask}
                        onToggleTask={onToggleTask}
                        onDeleteTask={onDeleteTask}
                        onAddTagToTask={onAddTagToTask}
                        onRemoveTagFromTask={onRemoveTagFromTask}
                        onAddReminder={onAddReminder}
                        onUpdateReminder={onUpdateReminder}
                        onDeleteReminder={onDeleteReminder}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskListProps {
  projectId: string;
  projectName: string;
  tasks: Task[];
  tags: Tag[];
  reminders: Reminder[];
  onAddTask: (projectId: string, title: string, description: string) => void;
  onUpdateTask: (id: string, title: string, description: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTagToTask: (taskId: string, tagId: string) => void;
  onRemoveTagFromTask: (taskId: string, tagId: string) => void;
  onAddReminder: (
    taskId: string,
    title: string,
    description: string,
    dueDate: string
  ) => void;
  onUpdateReminder: (
    id: string,
    title: string,
    description: string,
    dueDate: string
  ) => void;
  onDeleteReminder: (id: string) => void;
}

function TaskList({
  projectId,
  projectName,
  tasks,
  tags,
  reminders,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onAddTagToTask,
  onRemoveTagFromTask,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
}: TaskListProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(projectId, taskTitle.trim(), taskDescription.trim());
      setTaskTitle("");
      setTaskDescription("");
      setShowAddTask(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-gray-700">Tasks</h4>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Add New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Task description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false);
                    setTaskTitle("");
                    setTaskDescription("");
                  }}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No tasks yet</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              tags={tags}
              reminders={reminders.filter((r) => r.taskId === task.id)}
              projectName={projectName}
              onUpdateTask={onUpdateTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
              onAddTagToTask={onAddTagToTask}
              onRemoveTagFromTask={onRemoveTagFromTask}
              onAddReminder={onAddReminder}
              onUpdateReminder={onUpdateReminder}
              onDeleteReminder={onDeleteReminder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
