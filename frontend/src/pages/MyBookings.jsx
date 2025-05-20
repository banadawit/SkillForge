// pages/MyBookings.jsx
import { useEffect, useState } from 'react';
import axios from '../utils/axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/bookings/my/');
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Booked Sessions</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No sessions booked yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white shadow p-4 rounded-xl border"
            >
              <h2 className="text-lg font-semibold">
                {booking.skill.title}
              </h2>
              <p className="text-sm text-gray-600">
                Mentor: {booking.skill.mentor}
              </p>
              <p className="text-sm text-gray-600">
                Date: {booking.session_date}
              </p>
              <p className="text-sm text-gray-600">
                Time: {booking.session_time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
