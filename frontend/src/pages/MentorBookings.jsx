import { useEffect, useState } from "react";
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
import BookingCard from "../components/BookingCard";

const MentorBookings = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'accepted'

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);

      // Enhanced dummy data with status
      const dummyRequests = [
        {
          id: 1,
          learnerName: "Abdi Hassen",
          learnerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
          topic: "Django REST APIs",
          preferredTime: "2025-06-26T13:00",
          duration: 60,
          message: "Need help with class-based views and authentication.",
          status: "pending",
          skillLevel: "Intermediate",
        },
        {
          id: 2,
          learnerName: "Mimi Gelan",
          learnerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
          topic: "React State Management",
          preferredTime: "2025-06-27T10:30",
          duration: 90,
          message: "Want to understand Redux Toolkit best practices.",
          status: "pending",
          skillLevel: "Beginner",
        },
        {
          id: 3,
          learnerName: "Tewodros Kebede",
          learnerAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
          topic: "Advanced Python",
          preferredTime: "2025-06-28T15:00",
          duration: 120,
          message: "Help needed with async programming concepts.",
          status: "accepted",
          skillLevel: "Advanced",
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 800));
      setRequests(dummyRequests);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter
  );

  const handleAccept = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "accepted" } : req
      )
    );
    toast.success("Session booked successfully!");
  };

  const handleDecline = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
    toast.info("Request declined");
  };

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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No {filter === "all" ? "" : filter} requests found
            </h3>
            <p className="mt-1 text-gray-500">
              {filter === "accepted"
                ? "You haven't accepted any sessions yet"
                : "Check back later for new requests"}
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
