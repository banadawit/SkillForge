import { useState, useEffect } from "react";
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
  FiBookOpen,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getUser } from "../utils/auth";

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

  const handleDownloadNotes = (sessionId, type = "all") => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Downloading ${type} notes for session ${sessionId}`);
          resolve();
        }, 1000);
      }),
      {
        pending: `Preparing ${type === "all" ? "" : type + " "}notes...`,
        success: `Notes downloaded successfully!`,
        error: "Failed to download notes",
      }
    );
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
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {session.skill}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span
                                className={`status-badge ${session.status}`}
                              >
                                {session.status}
                              </span>
                              {session.statusDetails && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({session.statusDetails})
                                </span>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/profile/${session.mentorId}`}
                            className="flex items-center text-indigo-600 hover:underline"
                          >
                            <FiUser className="mr-1" />
                            {session.mentor}
                          </Link>
                        </div>

                        {/* Enhanced Progress Tracking */}
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-2" />
                            {new Date(session.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                            <span className="mx-2">•</span>
                            <FiClock className="mr-2" />
                            {session.time} ({session.duration})
                          </div>

                          {/* Progress bar with materials */}
                          {session.progress && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>
                                  {session.progress.completed}/
                                  {session.progress.total} sessions
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full"
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

                        {/* Session preparation section */}
                        <div className="mt-4">
                          <button
                            onClick={() =>
                              navigate(`/session-prep/${session.id}`)
                            }
                            className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            <FiBookOpen className="mr-2" />
                            View preparation materials
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleCancelSession(session.id)}
                          className="action-button danger"
                        >
                          <FiXCircle className="mr-2" />
                          Cancel Session
                        </button>
                        <button
                          onClick={() => navigate(`/reschedule/${session.id}`)}
                          className="action-button secondary"
                        >
                          <FiEdit className="mr-2" />
                          Reschedule
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/session-details/${session.id}`)
                          }
                          className="action-button primary"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EnhancedEmptyState
                type="upcoming"
                onAction={() => navigate("/skills")}
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pastSessions.length > 0 ? (
              pastSessions.map((session) => (
                <motion.div
                  key={session.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900">
                            {session.skill}
                          </h3>
                          <div className="flex items-center">
                            <span className={`status-badge ${session.status}`}>
                              {session.status}
                            </span>
                          </div>
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

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-2" />
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiClock className="mr-2" />
                            {session.duration}
                          </div>
                        </div>

                        {/* Enhanced Feedback Section */}
                        {session.feedback ? (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`${
                                    i < session.feedback.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  } w-4 h-4`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">
                                {session.feedback.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              "{session.feedback.comment}"
                            </p>
                          </div>
                        ) : session.status === "completed" ? (
                          <button
                            onClick={() => handleLeaveFeedback(session.id)}
                            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            <FiEdit className="mr-2" />
                            Leave Feedback
                          </button>
                        ) : null}

                        {/* Enhanced Materials Section */}
                        {session.notesAvailable && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FiDownload className="mr-2" />
                              Session Materials
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() =>
                                  handleDownloadNotes(session.id, "slides")
                                }
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FiDownload className="mr-1" /> Slides
                              </button>
                              <button
                                onClick={() =>
                                  handleDownloadNotes(session.id, "exercises")
                                }
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FiDownload className="mr-1" /> Exercises
                              </button>
                              <button
                                onClick={() =>
                                  handleDownloadNotes(session.id, "recording")
                                }
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FiDownload className="mr-1" /> Recording
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button
                          onClick={() =>
                            navigate(`/book-session/${session.mentorId}`)
                          }
                          className="action-button primary"
                        >
                          Rebook Mentor
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/similar-sessions/${session.skill}`)
                          }
                          className="action-button secondary"
                        >
                          Find Similar Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EnhancedEmptyState
                type="past"
                onAction={() => navigate("/skills")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Additional component for empty states
const EnhancedEmptyState = ({ type, onAction }) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
    <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-1">
      No {type === "upcoming" ? "upcoming" : "past"} sessions
    </h3>
    <p className="text-gray-500 mb-4">
      {type === "upcoming"
        ? "Book a session to start learning"
        : "Your completed sessions will appear here"}
    </p>
    <button
      onClick={onAction}
      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      {type === "upcoming" ? "Browse Skills" : "Find Mentors"}
      <FiChevronRight className="ml-1" />
    </button>
  </div>
);

export default MyLearning;
