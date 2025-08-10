import React, { useState } from "react";
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

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user"); 
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.id) {
        alert("User information missing. Please log in again.");
        return;
      }

      await api.post(
        "/todos",
        {
          title,
          description,
          status: (status || "todo").toLowerCase(),
          priority: (priority || "Medium").toLowerCase(),
          expected_completion_at: dueDate
            ? new Date(dueDate).toISOString()
            : null,
          user_id: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setPriority("");
      setStatus("");
      setDueDate("");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    }
  };

  return (
    <Modal
      title="New Task"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit Task
        </button>
      }
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />
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
    </Modal>
  );
};

export default PostModal;
