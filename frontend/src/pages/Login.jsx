// src/components/Login.jsx
import { useState, useEffect } from "react"; // Ensure useEffect is imported
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import { toast } from "react-toastify"; // Ensure toast is imported for direct use

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  });
  const navigate = useNavigate();

  // Get login function, isAuthenticated status, current user (decoded JWT payload),
  // and isMentor function from the AuthContext.
  const { login, user: authUser, isAuthenticated, isMentor: isAuthMentor, loading: authContextLoading } = useAuth();

  // ⭐ IMPORTANT: This useEffect handles redirection after authentication status is determined.
  // It ensures users are redirected if they are already logged in when trying to access /login,
  // or after a successful login.
  useEffect(() => {
    // Only attempt to redirect if AuthContext is *not* currently loading its initial auth state
    // and the user is authenticated.
    if (!authContextLoading && isAuthenticated) {
      // Use the isAuthMentor() function from the context to determine the role
      if (isAuthMentor()) { // isAuthMentor() properly checks authUser.is_mentor from JWT
        navigate("/my-skills"); // Mentor dashboard
      } else {
        navigate("/skills"); // Learner dashboard
      }
    }
  }, [authContextLoading, isAuthenticated, isAuthMentor, navigate]); // Dependencies: Re-run if auth status or loading state changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // The 'login' function from useAuth() calls loginUser from auth.js,
      // which returns the DECODED JWT payload (e.g., { user_id: 1, username: 'test', is_mentor: true, ... }).
      const loggedInUser = await login(form.username, form.password);

      // This 'if (loggedInUser)' block handles the redirection *immediately*
      // after a successful login API call.
      if (loggedInUser) {
        // Use loggedInUser.is_mentor directly from the JWT payload
        if (loggedInUser.is_mentor) {
          navigate("/my-skills"); // Navigate to mentor-specific path
        } else {
          navigate("/skills"); // Navigate to learner-specific path
        }
      } else {
        // This 'else' block should be rare if 'login' function handles toasts and throws errors correctly.
        // It's a fallback if login utility returns null without an error.
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      // The 'login' function in AuthContext (and auth.js) is designed to handle
      // error toasts internally. This catch block can be for general logging
      // or if you want to display specific component-level error messages.
      console.error("Login error caught in component:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setSocialLoading((prev) => ({ ...prev, [provider]: true }));
    toast.info(`Social login with ${provider} is not yet implemented.`);
    setSocialLoading((prev) => ({ ...prev, [provider]: false }));
  };

  // Prevent rendering the login form if AuthContext is still processing initial auth
  // OR if the user is already authenticated (and useEffect will redirect them).
  if (authContextLoading || isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-gray-700">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-indigo-100 mt-2">
              Sign in to your SkillConnect account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Social Login */}
            <div className="space-y-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading.google}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {socialLoading.google ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      d="M4 12a8 8 0 018-8V0..."
                    ></path>
                  </svg>
                ) : (
                  <>
                    <FcGoogle className="h-5 w-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin("facebook")}
                disabled={socialLoading.facebook}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white bg-[#1877F2] hover:bg-[#166FE5]"
              >
                {socialLoading.facebook ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      d="M4 12a8 8 0 018-8V0..."
                    ></path>
                  </svg>
                ) : (
                  <>
                    <FaFacebook className="h-5 w-5" />
                    <span>Continue with Facebook</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Username & Password */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 text-sm font-medium text-white rounded-lg transition ${
                isLoading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                    d="M4 12a8 8 0 018-8V0..."
                  ></path>
                </svg>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;