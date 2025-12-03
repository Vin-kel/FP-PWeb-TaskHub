"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Tambahkan tugas baru..."
        className="w-full px-6 py-4 pr-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none shadow-sm transition-all placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!inputValue.trim()}
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
}
