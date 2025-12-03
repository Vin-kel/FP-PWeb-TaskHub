"use client";

import {
  FolderKanban,
  CheckCircle2,
  Tags as TagsIcon,
  Bell,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { Project, Task, Tag, Reminder, View } from "../page";

interface HomeViewProps {
  projects: Project[];
  tasks: Task[];
  tags: Tag[];
  reminders: Reminder[];
  onViewChange: (view: View) => void;
}

export function HomeView({
  projects,
  tasks,
  tags,
  reminders,
  onViewChange,
}: HomeViewProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const upcomingReminders = reminders
    .filter((r) => new Date(r.dueDate) >= new Date())
    .slice(0, 5);
  const recentTasks = [...tasks]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "bg-blue-500",
      action: () => onViewChange("projects"),
    },
    {
      label: "Active Tasks",
      value: activeTasks.length,
      icon: CheckCircle2,
      color: "bg-green-500",
      action: () => onViewChange("tasks"),
    },
    {
      label: "Tags",
      value: tags.length,
      icon: TagsIcon,
      color: "bg-purple-500",
      action: () => onViewChange("tags"),
    },
    {
      label: "Upcoming Reminders",
      value: upcomingReminders.length,
      icon: Bell,
      color: "bg-amber-500",
      action: () => onViewChange("reminders"),
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Heres whats happening with your tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={stat.action}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-900">Task Completion</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-2xl text-gray-900">
                  {completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl text-gray-900">{completedTasks.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl text-gray-900">{activeTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-gray-900">Upcoming Reminders</h3>
            </div>
            {upcomingReminders.length > 0 && (
              <button
                onClick={() => onViewChange("reminders")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            )}
          </div>
          <div className="space-y-3">
            {upcomingReminders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No upcoming reminders
              </p>
            ) : (
              upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <Calendar className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {reminder.title}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      {formatDate(reminder.dueDate)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-gray-900">Recent Tasks</h3>
          </div>
          {tasks.length > 0 && (
            <button
              onClick={() => onViewChange("tasks")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          )}
        </div>
        <div className="space-y-2">
          {recentTasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No tasks yet. Create your first project!
            </p>
          ) : (
            recentTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const taskTags = tags.filter((tag) =>
                task.tagIds.includes(tag.id)
              );

              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm text-gray-900 ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    {project && (
                      <p className="text-xs text-gray-500 mt-1">
                        in {project.title}
                      </p>
                    )}
                    {taskTags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {taskTags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block px-2 py-0.5 rounded-full text-xs text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-white mb-2">Quick Actions</h3>
        <p className="text-blue-100 mb-4 text-sm">Get started with TaskHub</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onViewChange("projects")}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Create Project
          </button>
          <button
            onClick={() => onViewChange("tags")}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm backdrop-blur-sm"
          >
            Manage Tags
          </button>
          <button
            onClick={() => onViewChange("reminders")}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm backdrop-blur-sm"
          >
            View Reminders
          </button>
        </div>
      </div>
    </div>
  );
}
