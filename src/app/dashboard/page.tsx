'use client';

import { useState } from "react";
import { Header } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { ProjectsView } from "./components/ProjectView";
import { TasksView } from "./components/TaskView";
import { TagsView } from "./components/TagsView";
import { RemindersView } from "./components/RemindersView";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Reminder {
  id: string;
  taskId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  completed: boolean;
  tagIds: string[];
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export type View = "home" | "projects" | "tasks" | "tags" | "reminders";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [user] = useState({ name: "sapta" });

  // Project CRUD
  const addProject = (title: string, description: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, title: string, description: string) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, title, description } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setTasks(tasks.filter((t) => t.projectId !== id));
    const taskIdsToDelete = tasks
      .filter((t) => t.projectId === id)
      .map((t) => t.id);
    setReminders(reminders.filter((r) => !taskIdsToDelete.includes(r.taskId)));
  };

  // Task CRUD
  const addTask = (projectId: string, title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      projectId,
      title,
      description,
      completed: false,
      tagIds: [],
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, title: string, description: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, title, description } : t))
    );
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setReminders(reminders.filter((r) => r.taskId !== id));
  };

  const addTagToTask = (taskId: string, tagId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId && !t.tagIds.includes(tagId)
          ? { ...t, tagIds: [...t.tagIds, tagId] }
          : t
      )
    );
  };

  const removeTagFromTask = (taskId: string, tagId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, tagIds: t.tagIds.filter((id) => id !== tagId) }
          : t
      )
    );
  };

  // Tag CRUD
  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setTags([...tags, newTag]);
  };

  const updateTag = (id: string, name: string, color: string) => {
    setTags(tags.map((t) => (t.id === id ? { ...t, name, color } : t)));
  };

  const deleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    setTasks(
      tasks.map((t) => ({
        ...t,
        tagIds: t.tagIds.filter((tagId) => tagId !== id),
      }))
    );
  };

  // Reminder CRUD
  const addReminder = (
    taskId: string,
    title: string,
    description: string,
    dueDate: string
  ) => {
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      taskId,
      title,
      description,
      dueDate,
    };
    setReminders([...reminders, newReminder]);
  };

  const updateReminder = (
    id: string,
    title: string,
    description: string,
    dueDate: string
  ) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, title, description, dueDate } : r
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        userName={user.name}
      />

      <main>
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          {currentView === "home" && (
            <HomeView
              projects={projects}
              tasks={tasks}
              tags={tags}
              reminders={reminders}
              onViewChange={setCurrentView}
            />
          )}

          {currentView === "projects" && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              tags={tags}
              reminders={reminders}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onDeleteProject={deleteProject}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onAddTagToTask={addTagToTask}
              onRemoveTagFromTask={removeTagFromTask}
              onAddReminder={addReminder}
              onUpdateReminder={updateReminder}
              onDeleteReminder={deleteReminder}
            />
          )}

          {currentView === "tasks" && (
            <TasksView
              tasks={tasks}
              projects={projects}
              tags={tags}
              reminders={reminders}
              onUpdateTask={updateTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onAddTagToTask={addTagToTask}
              onRemoveTagFromTask={removeTagFromTask}
              onAddReminder={addReminder}
              onUpdateReminder={updateReminder}
              onDeleteReminder={deleteReminder}
            />
          )}

          {currentView === "tags" && (
            <TagsView
              tags={tags}
              onAddTag={addTag}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          )}

          {currentView === "reminders" && (
            <RemindersView
              reminders={reminders}
              tasks={tasks}
              projects={projects}
              onUpdateReminder={updateReminder}
              onDeleteReminder={deleteReminder}
            />
          )}
        </div>
      </main>
    </div>
  );
}
