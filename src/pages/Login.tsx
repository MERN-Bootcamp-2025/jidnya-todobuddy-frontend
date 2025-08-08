import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import api from "../api/axios";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setServerError("");

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      console.log("api response user:", user);
      console.log("api response token:", token);

      if (!user || !token) {
        setServerError("Invalid response from server.");
        return;
      }

      const userWithAdminFlag = {
        ...user,
        isAdmin: user.role === "admin", //user
      };

      console.log("modified user with isAdmin flag:", userWithAdminFlag);

      dispatch(login({ user: userWithAdminFlag, token }));

      console.log("fispatched login with:", {
        user: userWithAdminFlag,
        token,
      });

      navigate("/tasks");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Login error response:", error.response);
      if (error.response?.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else {
        alert("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex md:flex-row bg-white text-[#2C253D]">
      <div className="flex-1 ml-80 flex flex-col items-start justify-center py-10">
        <div className="w-full max-w-md">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* mail */}
            <div className="relative w-full mt-4">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className={`
                   peer w-full border-b py-2 bg-transparent placeholder-transparent
  focus:outline-none focus:ring-0 focus:border-[#2C253D]
  transition-colors duration-300
                  ${
                    emailError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#2C253D]"
                  }
                `}
              />
              <label
                htmlFor="email"
                className={`
                  absolute left-0 text-gray-500 transition-all duration-300
                  ${
                    emailFocused || email
                      ? "top-[-0.9rem] text-sm text-[#2C253D]"
                      : "top-2.5 text-base text-gray-400"
                  }
                `}
              >
                Email
              </label>
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* password */}
            <div className="relative mt-10 w-full mt-4">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={`
                  peer w-full border-b py-2 bg-transparent placeholder-transparent
  focus:outline-none focus:ring-0 focus:border-[#2C253D]
  transition-colors duration-300
                  ${
                    passwordError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#2C253D]"
                  }
                `}
              />
              <label
                htmlFor="password"
                className={`
                  absolute left-0 text-gray-500 transition-all duration-300
                  ${
                    passwordFocused || password
                      ? "top-[-0.9rem] text-sm text-[#2C253D]"
                      : "top-2.5 text-base text-gray-400"
                  }
                `}
              >
                Password
              </label>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}

            {/* submit */}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-400 text-white py-3 rounded-full shadow-md hover:bg-blue-500 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
