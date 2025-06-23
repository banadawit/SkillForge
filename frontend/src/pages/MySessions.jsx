import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiX,
  FiEdit,
  FiUpload,
  FiCheck,
  FiFileText,
  FiVideo,
  FiMessageSquare,
  FiStar,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getUser } from "../utils/auth";
import SessionStatusBadge from "../components/SessionStatusBadge";
import EmptyState from "../components/EmptyState";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mentor-specific dummy data
        const dummySessions = [
          {
            id: 1,
            learner: "Bena Dawit",
            learnerId: 202,
            skill: "Advanced React Patterns",
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            time: "15:00",
            duration: 90,
            status: "confirmed",
            notesUploaded: false,
            meetingLink: "https://meet.skillforge.com/react-advanced",
            materials: ["Context API Deep Dive", "Performance Optimization"],
            price: 45,
            earnings: 0,
            learnerLevel: "Intermediate",
            objectives: ["Master context usage", "Learn memoization"],
            learnerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            id: 2,
            learner: "Tola Mekonnen",
            learnerId: 203,
            skill: "Python Data Science",
            date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
            time: "10:00",
            duration: 120,
            status: "pending",
            notesUploaded: false,
            meetingLink: null,
            materials: ["Pandas Mastery", "Matplotlib Visualization"],
            price: 60,
            earnings: 0,
            learnerLevel: "Beginner",
            objectives: ["Data cleaning", "Basic visualizations"],
            learnerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            id: 3,
            learner: "Alem Hailu",
            learnerId: 204,
            skill: "JavaScript Fundamentals",
            date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
            time: "14:00",
            duration: 60,
            status: "completed",
            notesUploaded: true,
            meetingLink: null,
            materials: ["ES6 Features", "Async Patterns"],
            price: 35,
            earnings: 35,
            feedback: "Excellent explanation of closures!",
            rating: 4.8,
            learnerLevel: "Beginner",
            objectives: ["Understand scope", "Learn promises"],
            learnerAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
          },
          {
            id: 4,
            learner: "Dawit Kebede",
            learnerId: 205,
            skill: "UI/UX Career Coaching",
            date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
            time: "11:00",
            duration: 90,
            status: "completed",
            notesUploaded: true,
            meetingLink: null,
            materials: ["Portfolio Review", "Interview Prep"],
            price: 75,
            earnings: 75,
            feedback: "Great career advice!",
            rating: 5,
            learnerLevel: "Advanced",
            objectives: ["Improve portfolio", "Interview skills"],
            learnerAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
          },
        ];

        setSessions(dummySessions);
      } catch (error) {
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // ... (keep previous handler functions)

  const filteredSessions = sessions.filter((session) => {
    const now = new Date();
    const sessionDate = new Date(`${session.date}T${session.time}`);

    if (activeTab === "upcoming") {
      return (
        ["confirmed", "pending"].includes(session.status) && sessionDate > now
      );
    } else if (activeTab === "past") {
      return (
        ["completed", "cancelled"].includes(session.status) || sessionDate < now
      );
    }
    return true;
  });

  const calculateEarnings = () => {
    return sessions
      .filter((s) => s.status === "completed")
      .reduce((sum, session) => sum + (session.earnings || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Mentor Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your mentoring sessions and track your progress
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <FiDollarSign className="text-green-500 mr-2" />
                <span className="font-medium">Total Earnings:</span>
                <span className="ml-2 font-bold text-green-600">
                  ${calculateEarnings()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mt-6">
            <button
              className={`py-3 px-6 font-medium text-sm flex items-center ${
                activeTab === "upcoming"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              <FiCalendar className="mr-2" />
              Upcoming (
              {
                sessions.filter((s) =>
                  ["confirmed", "pending"].includes(s.status)
                ).length
              }
              )
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm flex items-center ${
                activeTab === "past"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past")}
            >
              <FiCheck className="mr-2" />
              Completed (
              {sessions.filter((s) => s.status === "completed").length})
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {session.skill}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded">
                                {session.duration} mins
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                ${session.price}
                              </span>
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                                {session.learnerLevel}
                              </span>
                            </div>
                          </div>
                          <SessionStatusBadge status={session.status} />
                        </div>

                        <div className="mt-4 flex items-start">
                          <img
                            src={session.learnerAvatar}
                            alt={session.learner}
                            className="w-12 h-12 rounded-full mr-3 mt-1"
                          />
                          <div>
                            <Link
                              to={`/mentor/learners/${session.learnerId}`}
                              className="hover:underline text-indigo-600 font-medium"
                            >
                              {session.learner}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              <p>Objectives: {session.objectives.join(", ")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-2 flex-shrink-0" />
                            <span>
                              {new Date(session.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiClock className="mr-2 flex-shrink-0" />
                            <span>{session.time} (Your local time)</span>
                          </div>
                        </div>

                        {session.materials && session.materials.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FiFileText className="mr-2" /> Teaching Materials
                            </h4>
                            <ul className="space-y-2">
                              {session.materials.map((material, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                  <span className="text-sm text-gray-600">
                                    {material}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 w-full lg:w-56">
                        {activeTab === "upcoming" && (
                          <>
                            <button
                              onClick={() => joinSession(session.meetingLink)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center transition-colors"
                            >
                              <FiVideo className="mr-2" />
                              Join Session
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/mentor/sessions/reschedule/${session.id}`
                                )
                              }
                              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
                            >
                              <FiEdit className="mr-2" />
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancel(session.id)}
                              className="px-4 py-2 border border-red-300 bg-white text-red-700 rounded-md hover:bg-red-50 flex items-center justify-center transition-colors"
                            >
                              <FiX className="mr-2" />
                              Cancel Session
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/mentor/sessions/prepare/${session.id}`
                                )
                              }
                              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
                            >
                              <FiBarChart2 className="mr-2" />
                              Prepare Materials
                            </button>
                          </>
                        )}

                        {activeTab === "past" && (
                          <>
                            {session.status === "completed" && (
                              <div className="bg-green-50 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Earned:</span>
                                  <span className="font-bold text-green-600">
                                    ${session.earnings}
                                  </span>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => handleUploadNotes(session.id)}
                              disabled={session.notesUploaded}
                              className={`px-4 py-2 rounded-md flex items-center justify-center transition-colors ${
                                session.notesUploaded
                                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                              }`}
                            >
                              <FiUpload className="mr-2" />
                              {session.notesUploaded
                                ? "Notes Uploaded"
                                : "Upload Notes"}
                            </button>
                            {session.feedback && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/mentor/sessions/feedback/${session.id}`
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
                              >
                                <FiMessageSquare className="mr-2" />
                                View Feedback
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState
                title={`No ${activeTab} sessions`}
                description={
                  activeTab === "upcoming"
                    ? "You don't have any upcoming mentoring sessions. Update your availability to get more bookings."
                    : "Your completed sessions will appear here."
                }
                icon={<FiCalendar className="w-12 h-12 text-gray-400" />}
                action={
                  activeTab === "upcoming" && (
                    <button
                      onClick={() => navigate("/mentor/availability")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Set Availability
                    </button>
                  )
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;
