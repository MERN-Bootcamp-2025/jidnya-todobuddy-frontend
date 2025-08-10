import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import PostModal from "../components/PostModal";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "On Hold" | "Done" | "Will Not Do";
  priority: "High" | "Medium" | "Low" | "Critical";
}

const statusColors: Record<string, string> = {
  "To Do": "bg-green-100 text-green-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "On Hold": "bg-gray-100 text-gray-700",
  Done: "bg-yellow-100 text-yellow-700",
  "Will Not Do": "bg-red-100 text-red-700",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
  Critical: "bg-purple-100 text-purple-700",
};

const MyTasks: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let todosArray: Task[] = [];

      if (Array.isArray(res.data)) {
        todosArray = res.data;
      } else if (Array.isArray(res.data.data)) {
        todosArray = res.data.data;
      } else if (Array.isArray(res.data.todos)) {
        todosArray = res.data.todos;
      }

      setTasks(todosArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
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
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
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
            <option value="On Hold">On Hold</option>
            <option value="Done">Done</option>
            <option value="Will Not Do">Will Not Do</option>
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
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <div className="mt-2 flex space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      statusColors[task.status] || ""
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      priorityColors[task.priority] || ""
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <img
                  src="/edit-thin.svg"
                  alt="Edit"
                  className="w-5 h-5 cursor-pointer hover:opacity-75"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowEditModal(true);
                  }}
                />
                <img
                  src="/delete-thin.png"
                  alt="Delete"
                  className="w-5 h-5 cursor-pointer hover:opacity-75"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDeleteModal(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      <PostModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchTasks}
      />

      {/* edit Modal */}
      <EditModal
        isOpen={showEditModal}
        task={selectedTask}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
      />

      {/* delet Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        taskId={selectedTask?.id || null}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default MyTasks;
