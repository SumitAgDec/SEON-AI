import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import { useUser } from "../context/user.context.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { setUser } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    await axios
      .post("/api/users/register", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", JSON.stringify(res.data));
        setUser(res.data);
        navigate("/");
      })
      .catch((error) => console.error(error.response.data));
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
