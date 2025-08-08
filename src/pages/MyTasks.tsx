import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Navbar from "../components/Navbar";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "High" | "Medium" | "Low";
  completed?: boolean;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Dashboard UI Design",
    description: "Design the user interface for the new dashboard.",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Backend API Development",
    description: "Develop the backend API for user authentication.",
    status: "To Do",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Unit Testing",
    description: "Write unit tests for the core modules.",
    status: "To Do",
    priority: "Low",
  },
  {
    id: 4,
    title: "Application Deployment",
    description: "Deploy the application to the production server.",
    status: "Done",
    priority: "High",
    completed: true,
  },
];

const statusColors: Record<string, string> = {
  "To Do": "bg-green-100 text-green-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Done: "bg-yellow-100 text-yellow-700",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const MyTasks: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">
            + New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search tasks..."
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">Filter by Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">Filter by Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-md shadow-sm bg-white flex justify-between items-center ${
                task.completed ? "opacity-50 line-through" : ""
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <div className="mt-2 flex space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      statusColors[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="/edit-thin.svg"
                  alt="Edit"
                  className="w-4 h-4 cursor-pointer"
                />
                <img
                  src="/delete-thin.png"
                  alt="Delete"
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
