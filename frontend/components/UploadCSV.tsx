"use client"
import { useState } from "react"
import axios from "axios"

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null)

  const upload = async () => {
    const formData = new FormData()
    formData.append("file", file!)
    formData.append("userId", localStorage.getItem("userId")!)

    await axios.post("http://localhost:5000/api/transactions/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    alert("CSV Uploaded")
  }

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold mb-2">Upload Bank CSV</h2>
      <input type="file" onChange={e => setFile(e.target.files![0])} />
      <button onClick={upload} className="bg-black text-white px-3 py-1 ml-2">Upload</button>
    </div>
  )
}
