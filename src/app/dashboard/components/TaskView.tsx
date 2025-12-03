"use client";

import type { Task, Tag, Reminder, Project } from "../page";
import { TaskItem } from "./TaskItem";

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  reminders: Reminder[];
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

export function TasksView({
  tasks,
  projects,
  tags,
  reminders,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onAddTagToTask,
  onRemoveTagFromTask,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
}: TasksViewProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-6">
          <h2 className="mb-2">All Tasks</h2>
          <p className="text-gray-600">Manage all your tasks across projects</p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">
              No projects yet. Create a project first to add tasks!
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">
              No tasks yet. Create your first task above!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-4">
                  Active Tasks ({activeTasks.length})
                </h3>
                <div className="space-y-2">
                  {activeTasks.map((task) => {
                    const project = projects.find(
                      (p) => p.id === task.projectId
                    );
                    return (
                      <TaskItem
                        key={task.id}
                        task={task}
                        tags={tags}
                        reminders={reminders.filter(
                          (r) => r.taskId === task.id
                        )}
                        projectName={project?.title}
                        onUpdateTask={onUpdateTask}
                        onToggleTask={onToggleTask}
                        onDeleteTask={onDeleteTask}
                        onAddTagToTask={onAddTagToTask}
                        onRemoveTagFromTask={onRemoveTagFromTask}
                        onAddReminder={onAddReminder}
                        onUpdateReminder={onUpdateReminder}
                        onDeleteReminder={onDeleteReminder}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-4">
                  Completed Tasks ({completedTasks.length})
                </h3>
                <div className="space-y-2">
                  {completedTasks.map((task) => {
                    const project = projects.find(
                      (p) => p.id === task.projectId
                    );
                    return (
                      <TaskItem
                        key={task.id}
                        task={task}
                        tags={tags}
                        reminders={reminders.filter(
                          (r) => r.taskId === task.id
                        )}
                        projectName={project?.title}
                        onUpdateTask={onUpdateTask}
                        onToggleTask={onToggleTask}
                        onDeleteTask={onDeleteTask}
                        onAddTagToTask={onAddTagToTask}
                        onRemoveTagFromTask={onRemoveTagFromTask}
                        onAddReminder={onAddReminder}
                        onUpdateReminder={onUpdateReminder}
                        onDeleteReminder={onDeleteReminder}
                      />
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
