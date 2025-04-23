import { useEffect, useState } from 'react';
import axios from '../utils/axios';

const SkillList = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const res = await axios.get('/skills/');
      setSkills(res.data);
    };
    fetchSkills();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Skills</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{skill.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Mentor: {skill.mentor}</p>
            <p className="text-gray-700 mb-1">{skill.description}</p>
            <p className="text-sm text-blue-600">Level: {skill.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;