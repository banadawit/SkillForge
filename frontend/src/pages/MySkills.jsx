import { useState, useEffect } from "react";
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

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const generateMockSkills = () => [
    {
      id: 1,
      name: "Advanced React Patterns",
      category: "Frontend Development",
      level: "Expert",
      rate: 45,
      sessionsCompleted: 28,
      avgRating: 4.9,
      description:
        "State management, performance optimization, and design patterns.",
      tags: ["Hooks", "Context API", "Memoization"],
      active: true,
    },
    {
      id: 2,
      name: "UI/UX Career Coaching",
      category: "Career Growth",
      rate: 75,
      level: "Advanced",
      sessionsCompleted: 15,
      avgRating: 5.0,
      description: "Portfolio reviews and interview preparation.",
      tags: ["Portfolio", "Interviews"],
      active: true,
    },
    {
      id: 3,
      name: "Python Data Science",
      category: "Data Analysis",
      rate: 60,
      level: "Intermediate",
      sessionsCompleted: 0,
      avgRating: null,
      description: "Pandas, NumPy fundamentals.",
      tags: ["Pandas", "Data Cleaning"],
      active: false,
    },
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSkills(generateMockSkills());
        toast.success("Skills loaded successfully");
      } catch (error) {
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkill = () => {
    const newSkill = {
      id: skills.length + 1,
      name: "New Skill",
      category: "General",
      level: "Beginner",
      rate: 50,
      sessionsCompleted: 0,
      avgRating: null,
      description: "New skill description",
      tags: [],
      active: false,
    };
    setSkills([...skills, newSkill]);
    toast.info("New mock skill added");
  };

  const handleDelete = (id) => {
    setSkills(skills.filter((s) => s.id !== id));
    toast.success("Skill deleted");
  };

  const handleToggleActive = (id) => {
    setSkills(
      skills.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const averageRate =
    skills.length > 0
      ? Math.round(
          skills.reduce((acc, cur) => acc + cur.rate, 0) / skills.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
          value={skills.filter((s) => s.active).length}
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
            onEdit={() => navigate(`/skills/edit/${skill.id}`)}
            onDelete={() => handleDelete(skill.id)}
            onToggleActive={() => handleToggleActive(skill.id)}
          />
        ))}
      </div>
    </div>
  );
};

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
              {skill.active && (
                <span className="ml-2 inline-block text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {skill.category}
              </span>
              <span className="bg-blue-100 px-2 py-1 rounded">
                {skill.level}
              </span>
              <span className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                <FiDollarSign className="mr-1" />
                {skill.rate}/hr
              </span>
            </div>
          </div>
          {skill.avgRating && (
            <div className="flex items-center text-yellow-500 font-semibold">
              <FiStar className="mr-1" />
              {skill.avgRating}
            </div>
          )}
        </div>

        <p className="mt-3 text-gray-600">{skill.description}</p>

        {skill.tags?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">
              Topics Covered:
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
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
            skill.active
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
