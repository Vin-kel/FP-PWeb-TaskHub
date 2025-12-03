"use client";

import { Bell, Calendar, Trash2 } from "lucide-react";
import type { Reminder, Task, Project } from "../page";

interface RemindersViewProps {
  reminders: Reminder[];
  tasks: Task[];
  projects: Project[];
  onUpdateReminder: (
    id: string,
    title: string,
    description: string,
    dueDate: string
  ) => void;
  onDeleteReminder: (id: string) => void;
}

export function RemindersView({
  reminders,
  tasks,
  projects,
  onDeleteReminder,
}: RemindersViewProps) {
  const getTaskInfo = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return null;
    const project = projects.find((p) => p.id === task.projectId);
    return { task, project };
  };

  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const upcomingReminders = sortedReminders.filter(
    (r) => new Date(r.dueDate) >= new Date()
  );

  const pastReminders = sortedReminders.filter(
    (r) => new Date(r.dueDate) < new Date()
  );

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

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
        year: "numeric",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6">Reminders</h2>

        {reminders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No reminders yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Add reminders to your tasks to get notified.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingReminders.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-4">Upcoming</h3>
                <div className="space-y-3">
                  {upcomingReminders.map((reminder) => {
                    const info = getTaskInfo(reminder.taskId);
                    return (
                      <div
                        key={reminder.id}
                        className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="w-4 h-4 text-blue-600" />
                              <h4 className="text-gray-900">
                                {reminder.title}
                              </h4>
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(reminder.dueDate)}</span>
                            </div>
                            {info && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                  Task:{" "}
                                  <span className="text-gray-700">
                                    {info.task.title}
                                  </span>
                                </p>
                                {info.project && (
                                  <p className="text-xs text-gray-500">
                                    Project:{" "}
                                    <span className="text-gray-700">
                                      {info.project.title}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteReminder(reminder.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pastReminders.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-4">Past Due</h3>
                <div className="space-y-3">
                  {pastReminders.map((reminder) => {
                    const info = getTaskInfo(reminder.taskId);
                    return (
                      <div
                        key={reminder.id}
                        className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-red-500 opacity-75"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="w-4 h-4 text-red-600" />
                              <h4 className="text-gray-900">
                                {reminder.title}
                              </h4>
                              <span className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded">
                                Overdue
                              </span>
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(reminder.dueDate)}</span>
                            </div>
                            {info && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                  Task:{" "}
                                  <span className="text-gray-700">
                                    {info.task.title}
                                  </span>
                                </p>
                                {info.project && (
                                  <p className="text-xs text-gray-500">
                                    Project:{" "}
                                    <span className="text-gray-700">
                                      {info.project.title}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteReminder(reminder.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
