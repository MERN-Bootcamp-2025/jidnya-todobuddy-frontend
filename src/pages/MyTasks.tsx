import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import PostModal from "../components/PostModal";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import Chip from "../components/Chip";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "On Hold" | "Done" | "Will Not Do";
  priority: "High" | "Medium" | "Low" | "Critical";
}

const MyTasks: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

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
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter
      ? task.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    const matchesPriority = priorityFilter
      ? task.priority.toLowerCase() === priorityFilter.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const currentTasks = filteredTasks.slice(
    startIndex,
    startIndex + tasksPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-gray-800">My Tasks</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + New Task
          </button>
        </div>

        {/* filters */}
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

        {/* task list */}
        <div className="space-y-4">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h3
                    className={`text-lg ${
                      task.status.toLowerCase() === "done"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="mt-2 flex space-x-2">
                    <Chip
                      type="status"
                      value={task.status}
                      taskId={task.id}
                      onUpdated={fetchTasks}
                    />
                    <Chip
                      type="priority"
                      value={task.priority}
                      taskId={task.id}
                      onUpdated={fetchTasks}
                    />
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
            ))
          ) : (
            <p className="text-gray-500">No tasks found.</p>
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === idx + 1 ? "bg-blue-600 text-white" : ""
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* modals */}
      <PostModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchTasks}
      />
      <EditModal
        isOpen={showEditModal}
        task={selectedTask}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
      />
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
