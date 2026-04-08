'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FlowSpace</h1>
        <p className="text-xl text-gray-600 mb-8">
          Multi-tenant SaaS for task and project management
        </p>

        <div className="space-y-4">
          <p className="text-gray-700 mb-6">
            Manage your organization&apos;s projects and tasks with confidence
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Phase 1 scaffolding complete ✓
        </p>
      </div>
    </main>
  );
}
