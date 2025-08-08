import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

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

    // just logging for now
    console.log("Email:", email);
    console.log("Password:", password);
    navigate('/tasks');
  };

  return (
    <div className="min-h-screen flex md:flex-row bg-white text-[#2C253D]">
      <div className="flex-1 ml-80 flex flex-col items-start justify-center py-10">
        <div className="w-full max-w-md">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* mail field */}
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
                  peer w-full border-b py-2 bg-transparent placeholder-transparent focus:outline-none 
                  transition-all
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

            {/* password field */}
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
                  peer w-full border-b py-2 bg-transparent placeholder-transparent focus:outline-none transition-all
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

            {/* submit btn */}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-400 text-white py-3 rounded-full shadow-md hover:bg-blue-500 transition"
              onClick={ handleLogin }
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
