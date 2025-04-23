import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { isMentor } from "../utils/auth";

const AddSkill = () => {
  const [form, setForm] = useState({ title: "", description: "", level: "" });
  const navigate = useNavigate();

//   useEffect(() => {
//     if (!isMentor()) {
//       navigate("/");
//     }
//   }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/skills/", form);
    navigate("/skills");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Skill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Skill Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Skill Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="level"
          value={form.level}
          onChange={handleChange}
          placeholder="Skill Level (e.g. Beginner)"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Skill
        </button>
      </form>
    </div>
  );
};

export default AddSkill;
