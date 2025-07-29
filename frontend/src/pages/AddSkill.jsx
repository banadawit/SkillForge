import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Use 'api' for authenticated requests, and 'useAuth' for auth context
import { api } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { FiPlus, FiX, FiInfo, FiDollarSign } from "react-icons/fi"; // Removed FiBarChart2 as it's not used
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddSkill = () => {
  // State for form data, matching Django Skill model fields
  const [form, setForm] = useState({
    name: "", // Renamed from 'title' to match backend 'name' field
    description: "",
    level: "intermediate",
    category: "",
    price: "", // Renamed from 'rate' to match backend 'price' field
    tags: [],
    currentTag: "", // For temporary tag input
  });
  const [loading, setLoading] = useState(false); // For form submission loading state
  const navigate = useNavigate();
  // Get authentication state from context
  const { isAuthenticated, isMentor, logout } = useAuth();

  // Redirect if not authenticated or not a mentor
  useEffect(() => {
    if (!isAuthenticated || !isMentor()) {
      toast.error("You must be logged in as a mentor to add skills.");
      logout(); // Log out and redirect to login
    }
  }, [isAuthenticated, isMentor, logout]); // Dependencies for useEffect

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagAdd = () => {
    const tag = form.currentTag.trim(); // Trim whitespace
    if (tag && !form.tags.includes(tag)) {
      // Check if tag is not empty and not already present
      setForm({
        ...form,
        tags: [...form.tags, tag],
        currentTag: "", // Clear current tag input after adding
      });
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setForm({
      ...form,
      tags: form.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data to send to backend, mapping frontend names to backend names
    const dataToSend = {
      name: form.name, // Send 'name' to backend
      description: form.description,
      level: form.level,
      category: form.category,
      price: Number(form.price), // Send 'price' to backend, ensure it's a number
      tags: form.tags, // Send tags as an array (matches Django's JSONField)
      // 'active', 'sessions_completed', 'avg_rating' are typically managed/defaulted by backend or through other flows
    };

    try {
      // Use api.post for authenticated POST request to /api/skills/
      const response = await api.post("/skills/", dataToSend);
      console.log("Skill added response:", response.data); // Log response for debugging

      toast.success("Skill added successfully!");
      navigate("/my-skills"); // Navigate back to mentor's skills list
    } catch (error) {
      console.error(
        "Failed to add skill:",
        error.response?.data || error.message
      );
      const errorData = error.response?.data;
      // Improved error display for specific field validation errors from backend
      if (errorData) {
        if (errorData.name) toast.error(`Skill Name: ${errorData.name[0]}`);
        if (errorData.description)
          toast.error(`Description: ${errorData.description[0]}`);
        if (errorData.level) toast.error(`Level: ${errorData.level[0]}`);
        if (errorData.category)
          toast.error(`Category: ${errorData.category[0]}`);
        if (errorData.price) toast.error(`Hourly Rate: ${errorData.price[0]}`);
        if (errorData.tags) toast.error(`Tags: ${errorData.tags[0]}`);
        if (errorData.detail)
          toast.error(errorData.detail); // General API errors
        else if (Object.keys(errorData).length > 0) {
          // Catch other unhandled field errors
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              toast.error(
                `${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                  errorData[key][0]
                }`
              );
            }
          });
        } else toast.error("Failed to add skill. Please check your input."); // Fallback
      } else {
        toast.error("Failed to add skill. An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const skillLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  const categories = [
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Data Science",
    "Career Growth",
    "Other",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-6 pt-16" // Added pt-16 for navbar spacing
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Teaching Skill
          </h1>
          <button
            onClick={() => navigate("/my-skills")} // Navigate back to MySkills list
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Name (formerly Title) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name *
              </label>
              <input
                name="name" // Changed name to 'name'
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Advanced React Patterns"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level *
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hourly Rate (now 'price') */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price" // Changed name to 'price'
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  min="1"
                  className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topics Covered
              </label>
              <div className="flex">
                <input
                  value={form.currentTag}
                  onChange={(e) =>
                    setForm({ ...form, currentTag: e.target.value })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleTagAdd())
                  }
                  placeholder="e.g. Hooks, Context API"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700"
                >
                  <FiPlus />
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1.5 text-indigo-600 hover:text-indigo-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what you'll teach in this skill area..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <FiInfo className="mr-1" /> This will be visible to potential
                learners
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/my-skills")} // Navigate back to My Skills list
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Add Skill
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddSkill;
