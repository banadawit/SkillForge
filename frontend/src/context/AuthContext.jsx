// src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getUser as getAuthUser, // Renamed to avoid state variable conflict
  loginUser as performLogin, // Renamed to avoid context function conflict
  logoutUser as performLogout, // Renamed
  refreshAuthTokens,
  clearAuthTokens,
  isMentor as checkIsMentor, // Renamed
} from "../utils/auth"; // Import all necessary functions from your auth utility

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  // Initialize user state by immediately trying to get the user from storage/token
  // This will return null if no valid token or expired
  const [user, setUser] = useState(() => getAuthUser());
  const [loading, setLoading] = useState(true); // State to indicate if initial auth check is complete

  // Function to perform initial user check and token refresh on app load
  const initializeAuth = useCallback(async () => {
    const currentUser = getAuthUser(); // Get user from potentially stored token (checks expiry)

    if (currentUser) {
      // If user exists and token is valid (not expired), set it directly
      setUser(currentUser);
    } else {
      // If no user or access token expired, try refreshing the token
      const refreshed = await refreshAuthTokens();
      if (refreshed) {
        // If refresh was successful, get the new user data from the new token
        setUser(getAuthUser());
      } else {
        // No valid token and refresh failed, ensure user is null and tokens are cleared
        setUser(null);
        clearAuthTokens();
        // Optionally, redirect to login if not already there, but do this carefully
        // to avoid infinite redirects on pages that don't require auth.
        // if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        //   navigate('/login');
        // }
      }
    }
    setLoading(false); // Authentication initialization is complete
  }, [navigate]); // navigate is a dependency for useCallback

  // Run initialization once when the AuthProvider mounts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function for components to call
  const login = useCallback(async (username, password) => {
    try {
      // Call the login utility function from auth.js
      const loggedInUser = await performLogin(username, password);
      if (loggedInUser) {
        setUser(loggedInUser); // Update context user state
        return loggedInUser; // Return user object for component-level redirection
      }
      return null; // Should ideally not be reached if performLogin throws on failure
    } catch (error) {
      setUser(null); // Ensure user state is null on login failure
      throw error; // Re-throw the error for the component to handle (e.g., display toast)
    }
  }, []);

  // Logout function for components to call
  const logout = useCallback(() => {
    performLogout(); // Call the logout utility function from auth.js
    setUser(null); // Clear user state in context
    navigate("/login"); // Redirect to login page after logout
  }, [navigate]);

  // isMentor function (can directly use checkIsMentor from auth.js)
  // or derive from context's user state: user?.is_mentor
  const isMentor = useCallback(() => {
    return checkIsMentor(); // Directly use the utility function
  }, []);

  const contextData = {
    user, // The decoded JWT payload (or null)
    loading, // True during initial auth check
    login, // Function to log in
    logout, // Function to log out
    isMentor, // Function to check if current user is mentor
    isAuthenticated: !!user, // Convenience boolean
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        // Optional: A global loading spinner while authentication is being checked on app load
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
