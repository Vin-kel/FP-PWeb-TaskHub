"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: illustration / mockup */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-[32px] bg-white shadow-xl border border-blue-100 overflow-hidden">
              <div className="absolute top-6 left-6 right-6 rounded-2xl bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold text-blue-700">Today</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  Finish Mobile Programming Assignment
                </p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white px-4 py-3 shadow-md">
                <p className="text-xs text-gray-500">Upcoming reminder</p>
                <p className="text-sm font-semibold text-gray-900">
                  PWEB Final Project Review
                </p>
                <p className="text-xs text-gray-500 mt-1">Tomorrow · 09:00</p>
              </div>
            </div>
          </div>

          {/* Right: text + CTA */}
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Stay on top of your tasks
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900">
              TaskHub
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
              Simple, fun, and effective way to manage your projects, tasks, and
              reminders in one clean dashboard.
            </p>

            <div className="mt-6 flex">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-10 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Get Started
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              No complex setup. Just create a project, add tasks, and start
              tracking your progress.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
