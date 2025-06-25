import { FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { FiUser, FiClock, FiCalendar, FiMessageSquare } from "react-icons/fi";

const BookingCard = ({ request, onAccept, onDecline }) => {
  const formattedDate = new Date(request.preferredTime).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  );

  const formattedTime = new Date(request.preferredTime).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
        request.status === "accepted" ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {request.topic}
              </h3>
              {request.status === "accepted" && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Accepted
                </span>
              )}
            </div>

            <div className="flex items-center mt-4">
              <img
                src={request.learnerAvatar}
                alt={request.learnerName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {request.learnerName}
                </p>
                <p className="text-sm text-gray-500">
                  Skill level: {request.skillLevel}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="mr-2" />
                <span>
                  {formattedTime} ({request.duration} mins)
                </span>
              </div>
            </div>

            {request.message && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMessageSquare className="mr-2" />
                  Learner's Message
                </h4>
                <p className="text-gray-600">{request.message}</p>
              </div>
            )}
          </div>

          {request.status === "pending" && (
            <div className="flex flex-col gap-2 w-full md:w-40">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAccept(request.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <FiCheck className="mr-2" />
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDecline(request.id)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center justify-center"
              >
                <FiX className="mr-2" />
                Decline
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
