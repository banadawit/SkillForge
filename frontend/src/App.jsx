import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import SkillList from "./pages/SkillList";
import AddSkill from "./pages/AddSkill";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/skills" element={<SkillList />} />
          <Route path="/add-skill" element={<AddSkill />} />
        </Routes>
        <ToastContainer /> {/* Add this line for the Toast notifications */}
      </AuthProvider>
    </Router>
  );
}
