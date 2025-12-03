"use client";

import { useState } from "react";
import {
  Trash2,
  Edit2,
  Check,
  X,
  Tag as TagIcon,
  Bell,
  Plus,
} from "lucide-react";
import type { Task, Tag, Reminder } from "../page";

interface TaskItemProps {
  task: Task;
  tags: Tag[];
  reminders: Reminder[];
  projectName?: string;
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

export function TaskItem({
  task,
  tags,
  reminders,
  projectName,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onAddTagToTask,
  onRemoveTagFromTask,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDueDate, setReminderDueDate] = useState("");

  const taskTags = tags.filter((tag) => task.tagIds.includes(tag.id));
  const availableTags = tags.filter((tag) => !task.tagIds.includes(tag.id));

  const saveEdit = () => {
    if (editTitle.trim()) {
      onUpdateTask(task.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (reminderTitle.trim() && reminderDueDate) {
      onAddReminder(
        task.id,
        reminderTitle.trim(),
        reminderDescription.trim(),
        reminderDueDate
      );
      setReminderTitle("");
      setReminderDescription("");
      setReminderDueDate("");
      setShowReminderForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
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
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <h5
                className={`text-gray-900 mb-1 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </h5>
              {projectName && (
                <p className="text-xs text-gray-400 mb-1">{projectName}</p>
              )}
              {task.description && (
                <p
                  className={`text-sm text-gray-600 ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {taskTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                  <button
                    onClick={() => onRemoveTagFromTask(task.id, tag.id)}
                    className="hover:bg-black/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="relative">
                <button
                  onClick={() => setShowTagMenu(!showTagMenu)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  <TagIcon className="w-3 h-3" />
                  Add Tag
                </button>
                {showTagMenu && availableTags.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          onAddTagToTask(task.id, tag.id);
                          setShowTagMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs"
              >
                <Bell className="w-3 h-3 text-amber-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-amber-900">{reminder.title}</p>
                  {reminder.description && (
                    <p className="text-amber-700">{reminder.description}</p>
                  )}
                  <p className="text-amber-600 mt-1">
                    Due: {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteReminder(reminder.id)}
                  className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {!showReminderForm ? (
              <button
                onClick={() => setShowReminderForm(true)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
                Add Reminder
              </button>
            ) : (
              <form
                onSubmit={handleAddReminder}
                className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2"
              >
                <input
                  type="text"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Reminder title..."
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  placeholder="Description..."
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <input
                  type="date"
                  value={reminderDueDate}
                  onChange={(e) => setReminderDueDate(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReminderForm(false)}
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
