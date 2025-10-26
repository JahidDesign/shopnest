// File: src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  getIdToken,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

// Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initial states from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "https://shopnest-ecom.onrender.com";
  const MAIN_ADMIN_EMAIL = "admin@shopnest.com";

  // Persist user & token in localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [user, token]);

  // Sync Firebase user with backend
  const syncWithBackend = useCallback(
    async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const idToken = await getIdToken(firebaseUser, true);

        // Attempt backend login
        const res = await fetch(`${API_URL}/customer/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          // Backend route not found or error → fallback
          console.warn("⚠️ Backend login failed, using local fallback");
          const fallbackUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            role: firebaseUser.email === MAIN_ADMIN_EMAIL ? "admin" : "customer",
          };
          setUser(fallbackUser);
          setToken("FAKE_TOKEN");
          return;
        }

        const data = await res.json();
        let updatedUser = data.user;

        // Assign roles
        updatedUser.role = updatedUser?.email === MAIN_ADMIN_EMAIL ? "admin" : "customer";

        setUser(updatedUser);
        setToken(data.token);
      } catch (err) {
        console.error("❌ Backend sync error:", err);

        // Fallback if backend fails
        const fallbackUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          role: firebaseUser.email === MAIN_ADMIN_EMAIL ? "admin" : "customer",
        };
        setUser(fallbackUser);
        setToken("FAKE_TOKEN");
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Listen for Firebase Auth state changes
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) await syncWithBackend(firebaseUser);
        else setLoading(false);
      });
      return () => unsubscribe();
    });
  }, [syncWithBackend]);

  // Google login
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) await syncWithBackend(result.user);
      toast.success("Login successful");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      toast.error("Login failed");
    }
  };

  // Manual login (email/password) or backend JWT
  const login = (userData, jwtToken) => {
    const updatedUser = { ...userData };
    updatedUser.role = updatedUser?.email === MAIN_ADMIN_EMAIL ? "admin" : "customer";

    setUser(updatedUser);
    setToken(jwtToken);
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("❌ Firebase sign out failed:", err);
    }
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loginWithGoogle,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "admin",
        role: user?.role || "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
