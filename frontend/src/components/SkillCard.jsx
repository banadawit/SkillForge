// components/SkillCard.jsx
import { useState } from 'react';
import BookingModal from './BookingModal';

const SkillCard = ({ skill }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold">{skill.title}</h2>
      <p className="text-sm text-gray-500 mb-2">Mentor: {skill.mentor}</p>
      <p className="text-gray-700 mb-1">{skill.description}</p>
      <p className="text-sm text-blue-600">Level: {skill.level}</p>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Book Session
      </button>

      {open && (
        <BookingModal
          skill={skill}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default SkillCard;
