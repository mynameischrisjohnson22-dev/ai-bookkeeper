"use client"

import { useEffect, useState } from "react"

export default function Settings() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  const toggleDark = () => {
    const html = document.documentElement

    if (html.classList.contains("dark")) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDark(false)
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDark(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">

      <div className="max-w-3xl mx-auto py-16 px-8">

        <h1 className="text-2xl font-semibold mb-10 text-slate-900 dark:text-white">
          Settings
        </h1>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Toggle dark theme for the application.
              </p>
            </div>

            <button
              onClick={toggleDark}
              className={`w-12 h-6 rounded-full relative transition ${
                dark ? "bg-slate-800" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  dark ? "left-7" : "left-1"
                }`}
              />
            </button>

          </div>

        </div>

        <button
          onClick={() => window.location.href = "/dashboard"}
          className="mt-10 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  )
}
