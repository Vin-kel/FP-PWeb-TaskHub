'use client';

import {
  CheckCircle2,
  LogOut,
  User,
  FolderKanban,
  ListTodo,
  Tag,
  Bell,
} from "lucide-react";
import { useState } from "react";
import type { View } from "../page";

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  userName: string;
}

export function Header({ currentView, onViewChange, userName }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { view: "projects" as View, label: "Projects", icon: FolderKanban },
    { view: "tasks" as View, label: "Tasks", icon: ListTodo },
    { view: "tags" as View, label: "Tags", icon: Tag },
    { view: "reminders" as View, label: "Reminders", icon: Bell },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onViewChange("home")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl text-gray-900">TaskHub</span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentView === item.view
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-700 hidden sm:block">
                {userName}
              </span>
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">User Account</p>
                  </div>
                  <button
                    onClick={() => {
                      alert("Logout clicked");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
