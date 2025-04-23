import { useState } from "react";
import axios from "../utils/axios"; // ✅ custom axios instance
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // optional for redirect

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "learner",
    bio: "",
  });

  const navigate = useNavigate(); // optional

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/accounts/register/", form); // ✅ cleaner
      toast.success("Registered successfully! You can now log in.");
      navigate("/login"); // optional: redirect after success
    } catch (err) {
      console.log(err.response?.data); // helpful for debugging
      toast.error("Registration failed. Please check your input.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full p-2 border"
          onChange={handleChange}
        >
          <option value="learner">Learner</option>
          <option value="mentor">Mentor</option>
        </select>
        <textarea
          name="bio"
          placeholder="Short Bio"
          className="w-full p-2 border"
          onChange={handleChange}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
