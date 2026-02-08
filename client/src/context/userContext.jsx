import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import API_PATHS from "../utils/apiPaths.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axiosInstance
      .get(API_PATHS.AUTH.GET_PROFILE)
      .then((res) => setUser(res.data))
      .catch(() => clearUser())
      .finally(() => setLoading(false));
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
