export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          TaskFlow
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Simple task & project management app to keep your work organized.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}
