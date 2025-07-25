import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  // Destructure 'user', 'logout', 'isAuthenticated', and 'isMentor' from useAuth()
  const { user, logout, isAuthenticated, isMentor } = useAuth(); // ⭐ CORRECTED: Destructure isMentor directly

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutFromMobile, setLogoutFromMobile] = useState(false);

  // handleLogout now just calls logout from context, no need to navigate here
  // as the context's logout already handles navigation to /login.
  const handleLogout = () => {
    logout(); // This also navigates to /login per AuthContext.js
    // No need for navigate("/login") here anymore.
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⭐ REMOVED: No longer need this local isMentor function
  // const isMentor = () => user?.role === "mentor";


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
              to={isAuthenticated ? (isMentor() ? "/my-skills" : "/skills") : "/"} // ⭐ IMPROVED: Link to relevant page or home if not logged in
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
              {/* ⭐ CORRECTED: Use isAuthenticated from context */}
              {isAuthenticated ? (
                <>
                  <Link
                    // ⭐ CORRECTED: Call isMentor() directly from context
                    to={isMentor() ? "/my-skills" : "/skills"}
                    className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    {isMentor() ? "My Skills" : "Browse Skills"}
                  </Link>

                  {isMentor() && ( // ⭐ CORRECTED: Call isMentor()
                    <Link
                      to="/add-skill"
                      className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                    >
                      Add Skill
                    </Link>
                  )}

                  {isMentor() && ( // ⭐ CORRECTED: Call isMentor()
                    <Link
                      to="/mentor-bookings"
                      className="text-white hover:bg-indigo-800 hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                    >
                      Booking Requests
                    </Link>
                  )}

                  <Link
                    // ⭐ CORRECTED: Call isMentor()
                    to={isMentor() ? "/my-sessions" : "/my-learning"}
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
                    onClick={() => {
                      setShowLogoutModal(true);
                      setLogoutFromMobile(false);
                    }}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                  >
                    Logout
                    <span className="ml-1 inline-block hover:animate-pulse">
                      →
                    </span>
                  </button>
                </>
              ) : (
                // Links for unauthenticated users
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
          {/* ⭐ CORRECTED: Use isAuthenticated for mobile menu conditional rendering */}
          {isAuthenticated && (
            <>
              <Link
                to={isMentor() ? "/my-skills" : "/skills"} // ⭐ CORRECTED: Call isMentor()
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {isMentor() ? "My Skills" : "Browse Skills"}
              </Link>

              {isMentor() && ( // ⭐ CORRECTED: Call isMentor()
                <Link
                  to="/add-skill"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Add Skill
                </Link>
              )}

              {/* ⭐ ADDED: Mentor-specific link for Booking Requests in mobile menu */}
              {isMentor() && (
                <Link
                  to="/mentor-bookings"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Booking Requests
                </Link>
              )}


              <Link
                to={isMentor() ? "/my-sessions" : "/my-learning"} // ⭐ CORRECTED: Call isMentor()
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {isMentor() ? "My Sessions" : "My Learning"}
              </Link>

              <Link
                to="/profile"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setLogoutFromMobile(true);
                  // setIsOpen(false); // Modal will cover, so can close mobile menu here if desired
                }}
                className="w-full text-left text-white bg-red-600 hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}

          {/* Links for unauthenticated users in mobile menu */}
          {!isAuthenticated && (
            <>
              <Link
                to="/skills"
                className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Browse Skills
              </Link>
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Logout
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (logoutFromMobile) setIsOpen(false);
                  handleLogout(); // Calls the handleLogout which now uses context.logout()
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;