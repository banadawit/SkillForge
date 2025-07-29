import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { api } from "../utils/auth"; // Import the configured Axios instance
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, isMentor, logout } = useAuth(); // Get auth state from context

  const fetchSkills = useCallback(async () => {
    // Ensure user is authenticated and is a mentor before fetching skills
    if (!isAuthenticated || !isMentor()) {
      toast.error("You must be logged in as a mentor to view this page.");
      logout(); // Log out and redirect to login
      return;
    }

    setLoading(true);
    try {
      // Use the 'api' instance for authenticated GET request to /api/skills/
      const response = await api.get("/skills/");
      // Axios puts the response data in the .data property
      setSkills(response.data);
    } catch (error) {
      console.error(
        "Error fetching skills:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to load skills.";
      toast.error(errorMessage);
      // If 401, interceptor should handle logout, but fallback here
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  }, [isAuthenticated, isMentor, logout]); // Dependencies for useCallback

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]); // Dependency array for useEffect

  const handleAddSkill = () => {
    // Navigate to a dedicated "Add Skill" form page
    navigate("/add-skill");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    try {
      // Use api.delete for DELETE request to /api/skills/:id/
      await api.delete(`/skills/${id}/`);
      setSkills(skills.filter((s) => s.id !== id)); // Optimistically update UI
      toast.success("Skill deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting skill:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to delete skill.";
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (id) => {
    // This functionality now dynamically updates the 'active' status on the backend
    const skillToUpdate = skills.find((s) => s.id === id);
    if (!skillToUpdate) return;

    try {
      // Call API to update 'active' status using PATCH request
      const response = await api.patch(`/skills/${id}/`, {
        active: !skillToUpdate.active,
      });
      // Update the skills state with the actual data from the backend response
      setSkills(skills.map((s) => (s.id === id ? response.data : s)));
      toast.success(
        `Skill "${response.data.name}" ${
          response.data.active ? "activated" : "deactivated"
        }.`
      );
    } catch (error) {
      console.error(
        "Error toggling skill active status:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to toggle skill status.";
      toast.error(errorMessage);
    }
  };

  // Calculate average rate based on 'price' field from backend
  const averageRate =
    skills.length > 0
      ? Math.round(
          skills.reduce((acc, cur) => acc + parseFloat(cur.price || 0), 0) /
            skills.length
        )
      : 0;

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Display message if no skills are found after loading
  if (skills.length === 0 && !loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 pt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          My Teaching Skills
        </h1>
        <p className="text-gray-600 mb-6">You haven't added any skills yet.</p>
        <button
          onClick={handleAddSkill}
          className="flex items-center mx-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium"
        >
          <FiPlus className="mr-2" />
          Add Your First Skill
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Teaching Skills</h1>
        <button
          onClick={handleAddSkill}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add Skill
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <StatCard
          title="Total Skills"
          value={skills.length}
          icon={<FiUsers />}
        />
        <StatCard
          title="Active Skills"
          value={skills.filter((s) => s.active).length} // 'active' now comes from backend
          icon={<FiStar />}
        />
        <StatCard
          title="Avg. Rate"
          value={`$${averageRate}`}
          icon={<FiDollarSign />}
        />
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onEdit={() => navigate(`/skills/edit/${skill.id}`)} // Navigate to edit page
            onDelete={() => handleDelete(skill.id)}
            onToggleActive={() => handleToggleActive(skill.id)}
          />
        ))}
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded shadow border p-4">
    <div className="flex items-center text-gray-500 mb-1">
      <span className="mr-2">{icon}</span>
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const SkillCard = ({ skill, onEdit, onDelete, onToggleActive }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white p-6 rounded-lg shadow border"
  >
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {skill.name}
              {skill.active && ( // 'active' reflects backend status
                <span className="ml-2 inline-block text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
              {skill.category && ( // Renders 'category' if available from backend
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {skill.category}
                </span>
              )}
              {skill.level && ( // Renders 'level' if available from backend
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {skill.level}
                </span>
              )}
              <span className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                <FiDollarSign className="mr-1" />
                {skill.price}/hr
              </span>
            </div>
          </div>
          {skill.avg_rating !== null && ( // Renders 'avg_rating' if available and not null
            <div className="flex items-center text-yellow-500 font-semibold">
              <FiStar className="mr-1" />
              {skill.avg_rating}
            </div>
          )}
        </div>

        {skill.description && ( // Renders 'description' if available from backend
          <p className="mt-3 text-gray-600">{skill.description}</p>
        )}

        {skill.tags?.length > 0 && ( // Renders 'tags' if available and not empty
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">
              Topics Covered:
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {skill.tags.map(
                (
                  tag,
                  index // Use index as key if tags are simple strings
                ) => (
                  <span
                    key={tag + index}
                    className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 md:w-40">
        <button
          className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
          onClick={onEdit}
        >
          <FiEdit2 className="mr-2" /> Edit
        </button>
        <button
          className={`flex items-center justify-center px-4 py-2 rounded ${
            skill.active // 'active' reflects backend status
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
          onClick={onToggleActive}
        >
          {skill.active ? "Deactivate" : "Activate"}
        </button>
        <button
          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
          onClick={onDelete}
        >
          <FiTrash2 className="mr-2" /> Delete
        </button>
      </div>
    </div>
  </motion.div>
);

export default MySkills;
