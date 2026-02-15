"use client"

import { useState } from "react"

export default function BusinessPage() {
  const [dark, setDark] = useState(true)

  const [numbers, setNumbers] = useState({
    expenses: "",
    dividends: "",
    freelance: "",
    investments: "",
    salary: "",
    other: ""
  })

  const handleChange = (e: any) => {
    setNumbers({ ...numbers, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    localStorage.setItem("businessNumbers", JSON.stringify(numbers))
    alert("Business numbers saved.")
  }

  const handleRemove = () => {
    localStorage.removeItem("businessNumbers")
    setNumbers({
      expenses: "",
      dividends: "",
      freelance: "",
      investments: "",
      salary: "",
      other: ""
    })
    alert("Business numbers removed.")
  }

  return (
    <div className={`${dark ? "bg-[#020b1f] text-white" : "bg-white text-black"} min-h-screen p-10`}>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Business</h1>
        <button
          onClick={() => setDark(!dark)}
          className="border px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Toggle Dark Mode
        </button>
      </div>

      <div className="space-y-4 max-w-xl">
        {Object.keys(numbers).map((key) => (
          <input
            key={key}
            name={key}
            value={(numbers as any)[key]}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="w-full p-4 rounded-lg bg-[#0f1a33] text-white placeholder-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ))}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-lg font-semibold"
          >
            Save Business Numbers
          </button>

          <button
            onClick={handleRemove}
            className="bg-red-600 px-6 py-3 rounded-lg font-semibold"
          >
            Remove Business Numbers
          </button>
        </div>
      </div>
    </div>
  )
}
