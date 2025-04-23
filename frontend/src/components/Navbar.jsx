import { Link, useNavigate } from 'react-router-dom';
import { getUser, isMentor } from '../utils/auth';

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">SkillConnect</Link>
      <div className="space-x-4">
        {user && <Link to="/skills">Skills</Link>}
        {isMentor() && <Link to="/add-skill">Add Skill</Link>}
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;