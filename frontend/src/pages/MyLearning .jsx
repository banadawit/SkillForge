import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { getUser } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiStar,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const MyLearning = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchSessions = async () => {
      try {
        // Simulated loading delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Dummy data for upcoming sessions
        const dummyUpcoming = [
          {
            id: 1,
            skill: "Advanced React Patterns",
            mentor: "Sarah Johnson",
            mentorId: 101,
            date: "2023-06-15",
            time: "14:00",
            duration: "1 hour",
            status: "confirmed",
            progress: { completed: 2, total: 5 },
            notesAvailable: true,
          },
          {
            id: 2,
            skill: "Node.js Performance Optimization",
            mentor: "Michael Chen",
            mentorId: 102,
            date: "2023-06-18",
            time: "10:30",
            duration: "1.5 hours",
            status: "confirmed",
            progress: { completed: 1, total: 3 },
            notesAvailable: false,
          },
          {
            id: 3,
            skill: "TypeScript Fundamentals",
            mentor: "Emma Wilson",
            mentorId: 103,
            date: "2023-06-22",
            time: "16:00",
            duration: "45 minutes",
            status: "pending",
            progress: { completed: 0, total: 4 },
            notesAvailable: false,
          },
        ];

        // Dummy data for past sessions
        const dummyPast = [
          {
            id: 4,
            skill: "JavaScript Fundamentals",
            mentor: "Alex Chen",
            mentorId: 102,
            date: "2023-05-10",
            duration: "1.5 hours",
            feedback: {
              rating: 4,
              comment:
                "Great session! Alex explained concepts clearly and provided helpful examples.",
            },
            notesAvailable: false,
          },
          {
            id: 5,
            skill: "CSS Grid Layout",
            mentor: "Priya Patel",
            mentorId: 104,
            date: "2023-04-28",
            duration: "2 hours",
            feedback: {
              rating: 5,
              comment:
                "Excellent mentor! I learned so much about responsive design.",
            },
            notesAvailable: true,
          },
          {
            id: 6,
            skill: "React Hooks Deep Dive",
            mentor: "Sarah Johnson",
            mentorId: 101,
            date: "2023-04-15",
            duration: "1 hour",
            feedback: null,
            notesAvailable: true,
          },
          {
            id: 7,
            skill: "GraphQL API Design",
            mentor: "David Kim",
            mentorId: 105,
            date: "2023-03-22",
            duration: "1.5 hours",
            feedback: {
              rating: 3,
              comment: "Good content but could use more practical examples.",
            },
            notesAvailable: true,
          },
        ];

        setUpcomingSessions(dummyUpcoming);
        setPastSessions(dummyPast);
      } catch (error) {
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user, navigate]);

  const handleCancelSession = (sessionId) => {
    if (window.confirm("Are you sure you want to cancel this session?")) {
      // Simulate API call
      setTimeout(() => {
        setUpcomingSessions(upcomingSessions.filter((s) => s.id !== sessionId));
        toast.success("Session cancelled successfully");
      }, 500);
    }
  };

  const handleLeaveFeedback = (sessionId) => {
    navigate(`/feedback/${sessionId}`);
  };

  const handleDownloadNotes = (sessionId) => {
    toast.info("Downloading session notes...");
    // Simulate download
    setTimeout(() => {
      toast.success("Notes downloaded successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            My Learning Journey
          </h1>
          <p className="text-lg text-gray-600">
            Track your sessions and progress
          </p>
        </motion.div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-800">
                Upcoming Sessions
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {upcomingSessions.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">
                Completed Sessions
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pastSessions.filter((s) => s.feedback).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">
                Skills in Progress
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {
                  [
                    ...new Set(
                      [...upcomingSessions, ...pastSessions].map((s) => s.skill)
                    ),
                  ].length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === "upcoming"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiCalendar className="mr-2" />
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === "past"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiCheckCircle className="mr-2" />
            Past Sessions
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : activeTab === "upcoming" ? (
          <div className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.skill}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              session.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center text-gray-600">
                          <FiUser className="mr-2" />
                          <Link
                            to={`/profile/${session.mentorId}`}
                            className="hover:text-indigo-600 hover:underline"
                          >
                            {session.mentor}
                          </Link>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="mr-2" />
                            {new Date(session.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-2" />
                            {session.time} ({session.duration})
                          </div>
                        </div>

                        {session.progress && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">Progress:</span>
                              <span>
                                {session.progress.completed}/
                                {session.progress.total} sessions
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-indigo-600 h-2.5 rounded-full"
                                style={{
                                  width: `${
                                    (session.progress.completed /
                                      session.progress.total) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                          onClick={() => handleCancelSession(session.id)}
                          className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <FiXCircle className="mr-2" />
                          Cancel
                        </button>
                        <button
                          onClick={() => navigate(`/reschedule/${session.id}`)}
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiEdit className="mr-2" />
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500">No upcoming sessions scheduled</p>
                <Link
                  to="/skills"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Skills <FiChevronRight className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pastSessions.length > 0 ? (
              pastSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {session.skill}
                        </h3>

                        <div className="mt-2 flex items-center text-gray-600">
                          <FiUser className="mr-2" />
                          <Link
                            to={`/profile/${session.mentorId}`}
                            className="hover:text-indigo-600 hover:underline"
                          >
                            {session.mentor}
                          </Link>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="mr-2" />
                            {new Date(session.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-2" />
                            {session.duration}
                          </div>
                        </div>

                        {session.feedback ? (
                          <div className="mt-4 flex items-center">
                            <div className="flex items-center mr-4">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`${
                                    i < session.feedback.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              "{session.feedback.comment}"
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleLeaveFeedback(session.id)}
                            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            <FiEdit className="mr-1" /> Leave Feedback
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/book-session/${session.mentorId}`)
                          }
                          className="flex items-center justify-center px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          Rebook Mentor
                        </button>
                        {session.notesAvailable && (
                          <button
                            onClick={() => handleDownloadNotes(session.id)}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FiDownload className="mr-2" />
                            Notes
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500">No past sessions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
