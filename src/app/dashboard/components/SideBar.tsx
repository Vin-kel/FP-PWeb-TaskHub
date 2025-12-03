"use client";

import { Home, FolderKanban, Tags, Bell, LogOut } from "lucide-react";
import type { View } from "../page";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  userName: string;
}

export function Sidebar({ currentView, onViewChange, userName }: SidebarProps) {
  const menuItems = [
    { id: "home" as View, label: "Home", icon: Home },
    { id: "projects" as View, label: "Projects", icon: FolderKanban },
    { id: "tags" as View, label: "Tags", icon: Tags },
    { id: "reminders" as View, label: "Reminders", icon: Bell },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl">TaskHub</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome, {userName}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
