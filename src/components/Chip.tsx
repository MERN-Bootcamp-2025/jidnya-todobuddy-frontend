import React, { useState } from "react";
import api from "../api/axios";

interface ChipProps {
  type: "status" | "priority";
  value: string;
  taskId: number;
  onUpdated: () => void; 
}

const statusColors: Record<string, string> = {
  "todo": "bg-green-100 text-green-700",
  "in progress": "bg-blue-100 text-blue-700",
  "on hold": "bg-gray-200 text-gray-700",
  "done": "bg-yellow-100 text-yellow-700",
  "will not do": "bg-red-100 text-red-700",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
  critical: "bg-purple-100 text-purple-700",
};

const statusOptions = ["todo", "in progress", "on hold", "done", "will not do"];
const priorityOptions = ["high", "medium", "low", "critical"];

const Chip: React.FC<ChipProps> = ({ type, value, taskId, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/todos/${taskId}`,
        { [type]: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    } finally {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <select
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        onBlur={handleUpdate}
        autoFocus
        className="border px-2 py-1 text-xs rounded"
      >
        {(type === "status" ? statusOptions : priorityOptions).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span
      className={`px-2 py-1 text-xs rounded cursor-pointer ${
        type === "status"
          ? statusColors[value.toLowerCase()] || ""
          : priorityColors[value.toLowerCase()] || ""
      }`}
      onClick={() => setIsEditing(true)}
    >
      {value}
    </span>
    
  );
};

export default Chip;
