import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // <-- user state
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setUser(data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async () => {
    await checkAuth();
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch {}
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        await checkAuth(); // Kullanıcı bilgisini güncelle
        return { success: true };
      } else {
        const err = await res.text();
        return { success: false, message: err };
      }
    } catch (e) {
      return { success: false, message: "Sunucu hatası" };
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 