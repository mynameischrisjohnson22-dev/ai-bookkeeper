"use client"

type Props = {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* MODAL */}

      <div className="relative bg-white w-[700px] h-[500px] rounded-xl shadow-2xl flex">

        {/* SIDEBAR */}

        <div className="w-48 border-r p-4 space-y-3 text-sm">

          <div className="font-semibold">General</div>
          <div className="text-gray-500">Notifications</div>
          <div className="text-gray-500">Security</div>
          <div className="text-gray-500">Billing</div>
          <div className="text-gray-500">Account</div>

        </div>

        {/* CONTENT */}

        <div className="flex-1 p-6">

          <div className="flex justify-between mb-6">

            <h2 className="text-xl font-semibold">
              Settings
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>

          </div>

          <p className="text-gray-600">
            Account settings and preferences.
          </p>

        </div>

      </div>

    </div>
  )
}