import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiChevronDown,
  FiDollarSign,
} from "react-icons/fi";
import { api } from "../utils/auth"; // Import the authenticated Axios instance
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const BookSessionPage = () => {
  const { id: skillId } = useParams(); // Get skill ID from URL
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth(); // Get auth state

  // State to hold the fetched skill data for display
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    preferredTime: "",
    duration: "60",
    skillLevel: "Beginner",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch skill details based on the URL ID
  const fetchSkillDetails = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to book a session.");
      logout(); // Logout and redirect
      return;
    }
    setLoading(true);
    try {
      // Fetch the skill details using the public endpoint (since it's open)
      const response = await api.get(`/skills/public/`);
      // Find the specific skill by ID from the list
      const skillFound = response.data.find((s) => s.id === parseInt(skillId));
      if (skillFound) {
        setSkill(skillFound);
      } else {
        toast.error("Skill not found.");
        navigate("/skills"); // Redirect if skill not found
      }
    } catch (error) {
      console.error("Error fetching skill details:", error);
      toast.error("Failed to load skill details.");
      // If 401, interceptor should handle, but a logout here is a good fallback
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [skillId, isAuthenticated, logout, navigate]);

  useEffect(() => {
    fetchSkillDetails();
  }, [fetchSkillDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.preferredTime) {
      toast.error("Please select a date and time");
      setIsSubmitting(false);
      return;
    }

    // Split the 'datetime-local' string into date and time
    const [session_date, session_time] = formData.preferredTime.split("T");

    // Prepare the data payload for the backend
    const bookingData = {
      skill: parseInt(skillId), // Pass the skill ID from URL params
      session_date: session_date,
      session_time: session_time,
      duration: parseInt(formData.duration),
      skill_level: formData.skillLevel,
      message: formData.message,
    };

    try {
      // ⭐ REPLACED: Use authenticated POST request to /api/bookings/
      const response = await api.post("/bookings/", bookingData);

      console.log("Booking Request Sent:", response.data);

      toast.success(
        <div>
          <p className="font-semibold">Booking request sent!</p>
          <p className="text-sm">The mentor will respond shortly</p>
        </div>
      );
      navigate("/my-learning");
    } catch (error) {
      console.error(
        "Failed to send booking request:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to send booking request.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slots
  const durationOptions = [15, 30, 45, 60, 90, 120].map((mins) => ({
    value: mins,
    label: `${mins} minutes`,
  }));

  // Render loading state for skill data fetch
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Render a message if skill data wasn't found after loading
  if (!skill) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <p className="text-gray-600">Error: Skill not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Book a Session</h1>
            <p className="text-indigo-100 mt-1">
              {`with ${skill.mentor} for "${skill.title}"`}{" "}
              {/* ⭐ Dynamic header! ⭐ */}
            </p>
            <div className="mt-2 flex items-center justify-center text-indigo-100 text-sm">
              <FiDollarSign className="mr-1" />
              <span>{`$${parseFloat(skill.price).toFixed(2)}/hr`}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date & Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiCalendar className="mr-2" />
                Preferred Date & Time *
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min={new Date().toISOString().slice(0, 16)} // Disable past dates
                />
              </div>
              {formData.preferredTime && (
                <p className="text-xs text-gray-500">
                  Selected: {new Date(formData.preferredTime).toLocaleString()}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiClock className="mr-2" />
                Session Duration *
              </label>
              <div className="relative">
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiUser className="mr-2" />
                Your Skill Level
              </label>
              <div className="relative">
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FiMessageSquare className="mr-2" />
                Learning Objectives
              </label>
              <div className="relative">
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What would you like to focus on during this session?"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex justify-center items-center ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                "Send Booking Request"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BookSessionPage;
