import { useEffect, useState, useCallback } from "react";
import {
  FiUser,
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { api } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ request, onAccept, onDecline }) => {
  const formattedDate = new Date(request.session_date).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  );
  const formattedTime = new Date(
    `2000-01-01T${request.session_time}`
  ).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiUser className="mr-2 text-indigo-600" />
            {request.learner_username}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Requested session for:{" "}
            <span className="font-semibold text-indigo-700">
              {request.skill_title}
            </span>{" "}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            request.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : request.status === "accepted"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700 mb-6">
        <div className="flex items-center">
          <FiCalendar className="mr-2 text-gray-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="mr-2 text-gray-500" />
          <span>
            {formattedTime} ({request.duration} mins)
          </span>{" "}
        </div>
        <div className="flex items-center col-span-full">
          <FiMessageSquare className="mr-2 text-gray-500" />
          <p className="italic">"{request.message}"</p>{" "}
        </div>
        <div className="flex items-center col-span-full">
          <FiUser className="mr-2 text-gray-500" />
          <p>Learner's Level: {request.skill_level}</p>{" "}
        </div>
      </div>

      {request.status === "pending" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onAccept(request.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            <FiCheck className="mr-2" /> Accept
          </button>
          <button
            onClick={() => onDecline(request.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
          >
            <FiX className="mr-2" /> Decline
          </button>
        </div>
      )}
    </motion.div>
  );
};

const MentorBookings = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { isAuthenticated, isMentor, logout } = useAuth();

  const fetchRequests = useCallback(async () => {
    if (!isAuthenticated || !isMentor()) {
      toast.error(
        "You must be logged in as a mentor to view booking requests."
      );
      logout();
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/bookings/");
      setRequests(response.data);
    } catch (error) {
      console.error(
        "Error fetching booking requests:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to load booking requests.";
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isMentor, logout]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter
  );

  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const bookingId = parseInt(id, 10);
      const response = await api.patch(`/bookings/${bookingId}/`, {
        status: newStatus,
      });

      console.log("API Response Data:", response.data);

      setRequests(
        requests.map((req) =>
          req.id === bookingId ? { ...req, ...response.data } : req
        )
      );

      toast.success(
        `Booking ${
          response.data.skill_title || "request"
        } ${newStatus} successfully!`
      );
    } catch (error) {
      console.error(
        `Error updating booking status to ${newStatus}:`,
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        `Failed to ${newStatus} booking.`;
      toast.error(errorMessage);
    }
  };

  const handleAccept = (id) => handleUpdateBookingStatus(id, "accepted");
  const handleDecline = (id) => handleUpdateBookingStatus(id, "declined");

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                filter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg ${
                filter === "pending"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-4 py-2 rounded-lg ${
                filter === "accepted"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Accepted
            </button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No {filter === "all" ? "" : filter} requests found
            </h3>
            <p className="mt-1 text-gray-500">
              {filter === "accepted"
                ? "You haven't accepted any sessions yet."
                : "Check back later for new requests."}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredRequests.map((req) => (
              <BookingCard
                key={req.id}
                request={req}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MentorBookings;
