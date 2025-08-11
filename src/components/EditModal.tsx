import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api/axios";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
  } | null;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  task,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status || "todo"); 
      setPriority(task.priority || "medium");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!task) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = { title, description, status, priority };

      const isOnlyStatusOrPriorityChanged =
        title === task.title && description === task.description;

      if (isOnlyStatusOrPriorityChanged) {
        await api.patch(
          `/todos/${task.id}`,
          { status, priority },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.put(`/todos/${task.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Task"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <label className="mt-4 block">Description:</label>
        <textarea
         // maxLength="250"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <label className="mt-4 block">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="on hold">On Hold</option>
          <option value="done">Done</option>
          <option value="will not do">Will Not Do</option>
        </select>
        <label className="mt-4 block">Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </Modal>
  );
};

export default EditModal;
