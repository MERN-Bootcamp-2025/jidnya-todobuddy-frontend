import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, footer }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-2">{footer}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
