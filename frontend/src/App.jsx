import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import SkillList from "./pages/SkillList";
import AddSkill from "./pages/AddSkill";
import Home from "./pages/Home";
import MyLearning from "./pages/MyLearning ";
import ProfilePage from "./pages/ProfilePage";
import MySessions from "./pages/MySessions";
import MySkills from "./pages/MySkills";
import MentorBookings from "./pages/MentorBookings";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/skills" element={<SkillList />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/my-skills" element={<MySkills />} />
          <Route path="/mentor-bookings" element={<MentorBookings />} />
        </Routes>
        <ToastContainer /> {/* Add this line for the Toast notifications */}
      </AuthProvider>
    </Router>
  );
}
