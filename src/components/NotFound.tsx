import React from "react";
import { Link } from "react-router-dom";
import notFoundImg from "../../public/not-found.png";

const NotFound: React.FC = () => {
  return (
    <div
      className="relative flex flex-col items-center min-h-screen text-center bg-cover bg-center"
      style={{ backgroundImage: `url(${notFoundImg})` }}
    >
      <div className="relative mt-[600px]">
        <h2 className="text-xl font-semibold text-black mb-6">
          Page Not Found
        </h2>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
