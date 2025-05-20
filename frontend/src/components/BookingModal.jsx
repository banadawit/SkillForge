import { useState } from "react";
import axios from "../utils/axios";

const BookingModal = ({ skill, onClose }) => {
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ error state

  const handleBooking = async () => {
    setError(""); // Clear old error
    try {
      setLoading(true);
      await axios.post("/bookings/", {
        skill: skill.id,
        session_date: sessionDate,
        session_time: sessionTime,
      });
      alert("Session booked!");
      onClose();
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (Array.isArray(err.response?.data)) {
        setError(err.response.data[0]);
      } else {
        setError("Booking failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-lg font-bold mb-2">Book: {skill.title}</h2>

        {/* ✅ Show error if exists */}
        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <label className="block mb-2">
          Date:
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full mt-1 border px-2 py-1 rounded"
          />
        </label>
        <label className="block mb-4">
          Time:
          <input
            type="time"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
            className="w-full mt-1 border px-2 py-1 rounded"
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Booking..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
