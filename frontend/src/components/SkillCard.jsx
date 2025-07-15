import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiClock, FiDollarSign, FiUser } from "react-icons/fi";

const SkillCard = ({ skill }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {skill.title}
          </h3>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
            <FiDollarSign className="inline mr-1" />
            {skill.price}/hr
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {skill.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
          <div className="flex items-center">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="font-medium text-gray-700">
              {skill.rating || "New"}
            </span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{skill.duration || 60} mins</span>
          </div>
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>{skill.sessions || 0} sessions</span>
          </div>
        </div>
      </div>

      <Link
        to={`/skills/${skill.id}/book`}
        className="block mx-4 mb-4 text-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm"
      >
        Book Session
      </Link>
    </motion.div>
  );
};

export default SkillCard;