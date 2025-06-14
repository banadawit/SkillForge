import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMentor = () => {
    return user?.is_mentor || false;
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-indigo-900 shadow-lg"
          : "bg-gradient-to-r from-indigo-900 to-indigo-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-indigo-200 transition-colors duration-300 flex items-center"
            >
              <span className="bg-white text-indigo-600 px-2 py-1 rounded mr-2">
                SC
              </span>
              <span className="hidden sm:inline">SkillConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/skills"
                    className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    {isMentor() ? "My Skills" : "Browse Skills"}
                  </Link>

                  {isMentor() && (
                    <Link
                      to="/add-skill"
                      className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                    >
                      Add Skill
                    </Link>
                  )}

                  <Link
                    to={isMentor() ? "/sessions" : "/my-learning"}
                    className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    {isMentor() ? "My Sessions" : "My Learning"}
                  </Link>

                  <Link
                    to="/profile"
                    className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                  >
                    Logout
                    <span className="ml-1 inline-block hover:animate-pulse">
                      →
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/skills"
                    className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Browse Skills
                  </Link>

                  <Link
                    to="/login"
                    className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="text-indigo-100 bg-indigo-600 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-800 focus:outline-none transition duration-300"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-800">
          {user && (
            <Link
              to="/skills"
              className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Skills
            </Link>
          )}
          {isMentor() && (
            <Link
              to="/add-skill"
              className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Add Skill
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left text-white bg-red-600 hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-indigo-600 hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
