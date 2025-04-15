

import React, { useState, useContext } from "react";
import { Lock, LogIn, User } from "lucide-react";
import { motion } from "framer-motion";
import loginImg from "../../images/login.png";
import { login } from "../../ApiService/AuthService/AuthApiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingContext } from "../../contexts/LoadingContext"; // Corrected path

const Login = ({ onLogin }) => {
 const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { startLoading, stopLoading } = useContext(LoadingContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading(); // Start global loading
    try {
      const response = await login({ username, password });
      const token = response.accessToken;
      onLogin(token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      stopLoading(); // Stop global loading
    }
  };

  return (
    <div className="h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={loginImg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm">
          <div className="absolute bottom-8 left-8">
            <h1 className="text-4xl font-bold text-balck mb-4">
              Shape Your Dream Home!
            </h1>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black bg-opacity-50 rounded-full"></div>
              <div className="w-2 h-2 bg-black bg-opacity-50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        className="bg-black/50 rounded-xl w-full max-w-lg p-8 relative shadow-2xl z-10"
      >
        <div className="absolute inset-0 bg-black rounded-xl backdrop-blur-sm -z-10" />

        {/* Logo/Icon Section */}
        <div className="flex justify-center mb-8 relative">
          <div className="bg-white shadow-2xl p-4 rounded-full relative">
            <div className="absolute " />
            <LogIn size={48} className="text-black animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-3  bg-clip-text text-white">
            Welcome Back
          </h3>
          <p className="text-white text-lg">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className=" p-6 rounded-xl space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-16 pr-4 py-3 bg-white border-2 border-slate-700 rounded-xl text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={28}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-16 pr-4 py-3 bg-white border-2 border-slate-700 rounded-xl text-black text-xl font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={28}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-lg text-white font-bold hover:text-blue-300 transition-colors duration-200"
            >
              Forgot Password?
            </a>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-white text-black text-lg rounded-lg
                       hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-bold
                       shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Sign In
            </motion.button>
          </div>
        </form>

        {/* <p className="mt-8 text-center text-slate-400">
          Don't have an account?
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
            Create Account
          </a>
        </p> */}
      </motion.div>
    </div>
  );
};

export default Login;
