import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/accounts/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data)); // ✅ persist user
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user"); // ✅ clear old user
        });
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post("http://localhost:8000/api/accounts/login/", {
      username,
      password,
    });
    const access = res.data.access;

    localStorage.setItem("token", access);
    setToken(access);

    // Immediately fetch and store user
    const userRes = await axios.get(
      "http://localhost:8000/api/accounts/profile/",
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );
    setUser(userRes.data);
    localStorage.setItem("user", JSON.stringify(userRes.data)); // ✅ store for refresh
    return userRes.data; // <-- return user object for role-based redirect
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ clear user data
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
