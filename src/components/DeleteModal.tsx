import React, { useState } from "react";
import Modal from "./Modal";
import api from "../api/axios";

interface DeleteModalProps {
  isOpen: boolean;
  taskId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  taskId,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.delete(`/todos/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={success ? "" : "Delete Task"}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        !success && (
          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        )
      }
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-center">
            <img
            src="/success-icon.png"
            alt="Success"
            className="w-20 h-20 mx-auto mb-4"
          />
          </div>
          
          <p className="text-lg font-medium text-black-600">
            Task deleted successfully!
          </p>
        </div>
      ) : (
        <p className="text-gray-700">
          Are you sure you want to delete this task? This is a soft delete, you
          can restore it later if needed.
        </p>
      )}
    </Modal>
  );
};

export default DeleteModal;
