import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api/axios";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setPriority("");
      setStatus("");
      setDueDate("");
      setError("");
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.id) {
        setError("User information missing. Please log in again.");
        setLoading(false);
        return;
      }

      await api.post(
        "/todos",
        {
          title,
          description,
          status: (status || "todo").toLowerCase(),
          priority: (priority || "medium").toLowerCase(),
          expected_completion_at: dueDate
            ? new Date(dueDate).toISOString()
            : null,
          user_id: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (onSuccess) onSuccess();
      setSuccess(true);
       setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={success ? "" : "New Task"} isOpen={isOpen} onClose={onClose} footer={null}>
      {!success ? (
        <div>
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}
          <label>Title:</label>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <label className="mt-4 block">Description:</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <label className="mt-4 block">Completion Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded"
            >
              <option value="">Select Status</option>
              <option value="todo">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Done">Done</option>
              <option value="Will Not Do">Will Not Do</option>
            </select>
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
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <img
            src="/success-icon.png"
            alt="Success"
            className="w-20 h-20 mx-auto mb-4"
          />
          <p className="text-black-600 mt-2">
            Task has been successfully added!
          </p>
        </div>
      )}
    </Modal>
  );
};

export default PostModal;
