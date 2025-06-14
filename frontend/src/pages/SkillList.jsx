import { useEffect, useState } from "react";
import axios from "../utils/axios";
import SkillCard from "../components/SkillCard";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const dummySkills = [
  {
    id: 1,
    title: "React Development",
    price: 45,
    mentor: "Sarah Johnson",
    description: "Master React hooks, context API, and modern best practices.",
    category: "Web Development",
    rating: 4.9,
    sessions: 128,
  },
  {
    id: 2,
    title: "UI/UX Design",
    price: 55,
    mentor: "Alex Chen",
    description:
      "Learn Figma, user research, and interaction design principles.",
    category: "Design",
    rating: 4.8,
    sessions: 96,
  },
  {
    id: 3,
    title: "Data Science",
    price: 60,
    mentor: "Dr. Michael Wong",
    description: "Python, Pandas, and machine learning fundamentals.",
    category: "Data Science",
    rating: 4.7,
    sessions: 84,
  },
  {
    id: 4,
    title: "Advanced JavaScript",
    price: 50,
    mentor: "Jamal Williams",
    description: "Deep dive into closures, prototypes, and async programming.",
    category: "Web Development",
    rating: 4.9,
    sessions: 112,
  },
  {
    id: 5,
    title: "Mobile App Development",
    price: 65,
    mentor: "Priya Patel",
    description: "Build cross-platform apps with React Native.",
    category: "Mobile",
    rating: 4.6,
    sessions: 75,
  },
  {
    id: 6,
    title: "DevOps Fundamentals",
    price: 70,
    mentor: "Carlos Mendez",
    description: "CI/CD pipelines, Docker, and Kubernetes basics.",
    category: "DevOps",
    rating: 4.8,
    sessions: 68,
  },
  {
    id: 7,
    title: "Digital Marketing",
    price: 40,
    mentor: "Lisa Thompson",
    description: "SEO, social media, and content marketing strategies.",
    category: "Marketing",
    rating: 4.5,
    sessions: 92,
  },
  {
    id: 8,
    title: "Product Management",
    price: 75,
    mentor: "David Kim",
    description: "Agile methodologies and product roadmapping.",
    category: "Business",
    rating: 4.9,
    sessions: 112,
  },
  {
    id: 9,
    title: "Python Automation",
    price: 45,
    mentor: "Emma Davis",
    description: "Automate repetitive tasks with Python scripts.",
    category: "Programming",
    rating: 4.7,
    sessions: 88,
  },
  {
    id: 10,
    title: "Blockchain Basics",
    price: 80,
    mentor: "Raj Patel",
    description: "Introduction to blockchain and smart contracts.",
    category: "Emerging Tech",
    rating: 4.8,
    sessions: 56,
  },
];

const categories = [...new Set(dummySkills.map((skill) => skill.category))];

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 8;

  useEffect(() => {
    // Simulate API call with dummy data
    setSkills(dummySkills);
    // Real API call would look like:
    // const fetchSkills = async () => {
    //   const res = await axios.get("/skills/");
    //   setSkills(res.data);
    // };
    // fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.mentor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = filteredSkills.slice(
    indexOfFirstSkill,
    indexOfLastSkill
  );
  const totalPages = Math.ceil(filteredSkills.length / skillsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 max-w-7xl mx-auto pt-20">
      {" "}
      {/* Added pt-20 for navbar spacing */}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <option value="All">All Categories</option>
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
            <SkillCard key={skill.id} skill={skill} />
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
      {filteredSkills.length > skillsPerPage && (
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
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummySkills
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map((skill) => (
              <div
                key={skill.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {skill.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ${skill.price}/hr
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {skill.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-yellow-600">★ {skill.rating}</span>
                  <span className="text-gray-500">
                    {skill.sessions} sessions
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillList;
