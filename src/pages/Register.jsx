import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://shopnest-ecom.onrender.com"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && (!value.trim() || value.trim().length < 2)) {
      error = "Name must be at least 2 characters.";
    }
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = "Invalid email address.";
    }
    if (name === "password" && !/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value)) {
      error =
        "Password must be at least 6 characters with upper and lower case letters.";
    }
    if (name === "photo" && value.trim()) {
      try {
        new URL(value);
      } catch {
        error = "Invalid photo URL.";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const saveUserToBackend = async (userData) => {
    const res = await fetch(`${API_URL}/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save user");
    return data;
  };

  const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  };

  const googleLogin = async (uid, email, name, photo) => {
    const res = await fetch(`${API_URL}/customer/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, email, name, photo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google login failed");
    return data;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) currentErrors[key] = err;
    });
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name,
        ...(formData.photo ? { photoURL: formData.photo } : {}),
      });

      await saveUserToBackend({
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photo: formData.photo,
        phone: formData.phone,
        role: "customer",
        status: "active",
      });

      const loginData = await loginUser(formData.email, formData.password);
      login(loginData.user, loginData.token);

      Swal.fire("Success!", "Account created successfully.", "success").then(() =>
        navigate("/")
      );
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        Swal.fire("Email already in use", "Try logging in.", "warning");
      } else {
        Swal.fire("Error", err.message || "Something went wrong.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        Swal.fire(
          "Google account has no email",
          "Please use another account.",
          "error"
        );
        return;
      }

      const loginData = await googleLogin(
        user.uid,
        user.email,
        user.displayName || "Google User",
        user.photoURL
      );
      login(loginData.user, loginData.token);

      Swal.fire("Welcome!", "Signed in with Google!", "success").then(() =>
        navigate("/")
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Google Sign-in Failed", err.message || "Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 justify-center items-center px-4">
      <Helmet>
        <title>Register | Smart Insurance</title>
      </Helmet>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join our platform to get started</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {["name", "email", "photo", "phone"].map((field) => (
            <div key={field}>
              <input
                name={field}
                type={
                  field === "email" ? "email" : field === "photo" ? "url" : "text"
                }
                placeholder={
                  field === "name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email Address"
                    : field === "photo"
                    ? "Photo URL (Optional)"
                    : "Phone Number (Optional)"
                }
                value={formData[field]}
                onChange={handleChange}
                disabled={loading}
                className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full border px-4 py-3 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF6600]"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF6600] to-orange-500 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">— or —</div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full border-2 border-[#FF6600] text-[#FF6600] py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#FF6600] hover:text-white transform hover:scale-105 transition-all disabled:opacity-50 shadow-sm"
        >
          <FcGoogle size={22} /> Sign Up with Google
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <NavLink to="/login" className="text-[#FF6600] underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
