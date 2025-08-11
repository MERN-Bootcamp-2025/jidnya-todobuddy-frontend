import React, { useState, useEffect } from "react";
import api from "../api/axios";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setRole("admin");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!name.trim() || !email.trim() || !role.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/invite",
        { name, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onSuccess) onSuccess();
      setSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {!success ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Invite New User</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <div className="text-left space-y-4">
              <div>
                <label className="block font-medium">Enter name:</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Enter email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Enter role:</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded border"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleInvite}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src="/success-icon.png"
              alt="Success"
              className="w-20 h-20 mx-auto mb-4"
            />
            <p className="text-black-600 mt-2 text-center">
              The invitation email has been successfully sent to {email}.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
