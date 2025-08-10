import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import type { User } from "../redux/authSlice";
import InviteModal from "./InviteModal";

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!user) return null;

  const avatarLetter = user.email?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
    <nav className="w-full bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-semibold text-gray-800">todobuddy.</div>

      <div className="flex space-x-4">
        <Link
          to="/tasks"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          My Tasks
        </Link>
      </div>

      {/* avatar */}

      <div className="flex items-center space-x-4">
        {user.role === "admin" && (
          <button
            className="hover:opacity-80 transition"
            title="Add User"
            onClick={() => setShowInviteModal(true)}
          >
            <img src="/plus-thin.png" alt="Add User" className="w-6 h-6" />
          </button>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold">
              {avatarLetter}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 text-black z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
    <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => console.log("Invite sent successfully")}
      />
      </>
  );
};

export default Navbar;
