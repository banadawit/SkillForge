import { useEffect, useState, useCallback } from "react";
import { api } from "../utils/auth"; // For authenticated requests
import { useNavigate } from "react-router-dom"; // For navigation
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiDollarSign,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// This is a generic SkillCard component that can be used by both
// MySkills.jsx and SkillList.jsx. It's defined here for clarity.
const SkillCard = ({ skill, onBook, onEdit, onDelete, onToggleActive }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow duration-200"
  >
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">
            {skill.title} {/* Maps to skill.name from backend */}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ${parseFloat(skill.price).toFixed(2)}/hr {/* Maps to skill.price */}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Mentor:</span>
          <span className="font-medium text-indigo-600">
            {skill.mentor}
          </span>{" "}
          {/* Maps to mentor username */}
        </div>
        {skill.rating !== null && ( // Only show rating if it exists
          <span className="text-yellow-600 flex items-center">
            <FiStar className="mr-1" /> {parseFloat(skill.rating).toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-4">
        {/* The onBook prop is for this SkillList component */}
        {onBook && (
          <button
            onClick={() => onBook(skill.id)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            Book Session
            <FiChevronRight className="ml-2" />
          </button>
        )}
        {/* Add logic for edit/delete buttons for the MySkills component here if needed */}
      </div>
    </div>
  </motion.div>
);

const SkillList = () => {
  const [allSkills, setAllSkills] = useState([]);
  const [skillsToDisplay, setSkillsToDisplay] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const skillsPerPage = 8;

  // Dynamically generate categories from the fetched data
  const [categories, setCategories] = useState(["All"]);
  useEffect(() => {
    if (allSkills.length > 0) {
      const uniqueCategories = [
        ...new Set(allSkills.map((skill) => skill.category)),
      ];
      setCategories(["All", ...uniqueCategories.filter(Boolean)]); // Filter out null/undefined categories
    }
  }, [allSkills]);

  const fetchAllSkills = useCallback(async () => {
    try {
      setLoading(true);
      // Use the 'api' instance to fetch from the new public endpoint
      const response = await api.get("/skills/public/");
      setAllSkills(response.data);
    } catch (error) {
      console.error(
        "Failed to load skills:",
        error.response?.data || error.message
      );
      toast.error("Failed to load skills from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSkills();
  }, [fetchAllSkills]);

  useEffect(() => {
    let filtered = allSkills;
    if (searchQuery) {
      filtered = filtered.filter(
        (skill) =>
          skill.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.mentor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (skill) => skill.category === selectedCategory
      );
    }
    setSkillsToDisplay(filtered);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [allSkills, searchQuery, selectedCategory]);

  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = skillsToDisplay.slice(
    indexOfFirstSkill,
    indexOfLastSkill
  );
  const totalPages = Math.ceil(skillsToDisplay.length / skillsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBookSession = (skillId) => {
    navigate(`/book/${skillId}`); // Navigate to a booking page with the skill ID
  };

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto pt-20 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto pt-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Explore Available Skills
        </h1>
        <p className="text-gray-600">
          Find the perfect mentor to help you grow
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search skills or mentors..."
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentSkills.length > 0 ? (
          currentSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onBook={handleBookSession}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No skills found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {skillsToDisplay.length > skillsPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>

            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 border-t border-b border-gray-300 ${
                  currentPage === number + 1
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </nav>
        </div>
      )}

      {/* Popular Skills Section */}
      <div className="mt-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              🌟 Popular Skills
            </h2>
            <p className="text-gray-600">
              Trending skills our community is learning
            </p>
          </div>
          <button
            onClick={() => navigate("/skills")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allSkills // Use the full skills list to find popular ones
            .filter((s) => s.rating !== null) // Only show skills with a rating
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onBook={handleBookSession}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillList;
