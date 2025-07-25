import { useState, useEffect, useCallback } from "react";
// Import 'api' from your auth utilities for all authenticated requests
// Import 'useAuth' from context for user state and logout function
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiEdit,
  FiLock,
  FiCalendar,
  FiStar,
  FiAward,
  FiPlusCircle,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { api } from "../utils/auth"; // Import the configured Axios instance

// const API_BASE_URL = "http://localhost:8000/api"; // Not strictly needed with 'api' instance's baseURL

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Manually managing loading state for fetches
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [newSkillPrice, setNewSkillPrice] = useState("");

  const navigate = useNavigate();
  // Get user and logout from AuthContext
  const {
    user,
    isAuthenticated,
    isMentor: isCurrentUserMentor,
    logout,
  } = useAuth();

  // Remove getAuthHeaders as 'api' instance handles headers automatically

  const fetchData = useCallback(async () => {
    // Check authentication status from context.
    // AuthProvider's useEffect should handle redirecting if not authenticated.
    if (!isAuthenticated) {
      // If not authenticated, context will handle navigation.
      // We can just stop loading here or let the context's redirect take over.
      setLoading(false);
      // Optionally, you might want a toast if they landed here without being logged in
      // toast.error("Please log in to view your profile.");
      return;
    }

    setLoading(true); // Start loading before fetching
    try {
      // 1. Fetch User Profile Data using 'api' instance (Axios)
      const profileResponse = await api.get("/profile/"); // Use api.get() for GET requests
      const profileData = profileResponse.data; // Axios puts response data in .data

      const transformedProfile = {
        fullName: profileData.full_name,
        email: profileData.email,
        bio: profileData.profile.bio,
        role: profileData.profile.role,
        availability: profileData.profile.availability,
        // These fields would typically come from specific models/calculations in Django
        sessionCount: profileData.profile.session_count || 0, // Placeholder
        skillsLearned: profileData.profile.skills_learned || [], // Placeholder
        topSkills: profileData.profile.top_skills || [], // Placeholder
      };
      setProfile(transformedProfile);
      setFormData({
        fullName: transformedProfile.fullName,
        email: transformedProfile.email,
        bio: transformedProfile.bio,
        availability: transformedProfile.availability,
      });

      // 2. Fetch Skills (if mentor)
      // Use isCurrentUserMentor from useAuth context, as it's reliable
      if (isCurrentUserMentor) {
        // Use the context's isMentor flag
        const skillsResponse = await api.get("/skills/");
        setSkills(skillsResponse.data);
      } else {
        setSkills([]); // Clear skills if not a mentor
      }

      // 3. Fetch Reviews
      const reviewsResponse = await api.get("/reviews/");
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to load profile data.";
      toast.error(errorMessage);
      // If error is due to auth (interceptor might have already handled it by redirecting),
      // ensure local state is cleared and navigate if not already.
      if (
        error.message.includes("Session expired") ||
        error.message.includes("Authentication required")
      ) {
        logout(); // Call logout from context which also navigates
      }
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  }, [isAuthenticated, isCurrentUserMentor, logout, navigate]); // Add isAuthenticated to dependencies

  useEffect(() => {
    // Only fetch data if authenticated to prevent unnecessary calls before user is known
    // The loading state of AuthProvider should handle initial render.
    if (isAuthenticated) {
      fetchData();
    }
  }, [fetchData, isAuthenticated]); // isAuthenticated is a dependency to re-run if auth state changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use api.patch for PATCH requests
      const response = await api.patch("/profile/", {
        profile: {
          bio: formData.bio,
          availability: formData.availability,
        },
      });

      const updatedProfileData = response.data; // Axios data is in .data
      setProfile((prev) => ({
        ...prev,
        bio: updatedProfileData.profile.bio,
        availability: updatedProfileData.profile.availability,
      }));
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to update profile.";
      toast.error(errorMessage);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim() || isNaN(parseFloat(newSkillPrice))) {
      toast.error("Please enter a valid skill name and price.");
      return;
    }

    try {
      // Use api.post for POST requests
      const response = await api.post("/skills/", {
        name: newSkill,
        price: parseFloat(newSkillPrice),
      });

      const addedSkill = response.data; // Axios data is in .data
      setSkills((prev) => [...prev, addedSkill]);
      setNewSkill("");
      setNewSkillPrice("");
      toast.success("Skill added successfully!");
    } catch (error) {
      console.error(
        "Error adding skill:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Skill could not be added.";
      toast.error(errorMessage);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      // Use api.delete for DELETE requests
      await api.delete(`/skills/${skillId}/`); // Axios returns empty data for delete, so no .data

      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      toast.success("Skill removed successfully!");
    } catch (error) {
      console.error(
        "Error removing skill:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to remove skill.";
      toast.error(errorMessage);
    }
  };

  const handleBecomeMentor = async () => {
    try {
      // Use api.post for POST requests
      await api.post("/become-mentor/");

      toast.success(
        "You are now a mentor! Please log out and log back in to see changes."
      );
      logout(); // Call logout from AuthContext which handles navigation
    } catch (error) {
      console.error(
        "Error becoming mentor:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to become mentor.";
      toast.error(errorMessage);
    }
  };

  // Render loading spinner from this component
  // If useAuth().loading is true, AuthProvider will show a global spinner.
  // This 'loading' state here is for the component's *own* data fetching.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If profile is null after loading, it means data fetch failed or user isn't authenticated
  if (!profile) {
    return (
      <div className="text-center py-12">
        Failed to load profile or not authenticated.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-16 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiEdit className="mr-2" />
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </button>
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiLock className="mr-2" />
              Change Password
            </button>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row">
              {/* Left Column - Profile Info */}
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-4xl font-bold">
                    {profile.fullName.charAt(0)}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile.fullName}
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mt-2">
                    {isCurrentUserMentor ? "Mentor" : "Learner"}
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="md:w-2/3 md:pl-8">
                {/* Bio Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    About
                  </h3>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-3 h-32"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profile.bio || "No bio provided yet."}
                    </p>
                  )}
                </div>

                {/* Contact Info (Email is read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Email
                    </h3>
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-2" />
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mentor-Specific Sections */}
                {isCurrentUserMentor && (
                  <>
                    {/* Skills Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiAward className="mr-2" /> Skills Offered
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills?.length > 0 ? (
                          skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill.name}
                              {skill.price > 0 && (
                                <span className="ml-1">
                                  (${parseFloat(skill.price).toFixed(2)}/hr)
                                </span>
                              )}
                              {editMode && (
                                <button
                                  onClick={() => handleRemoveSkill(skill.id)}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  <FiX size={14} />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills added yet</p>
                        )}
                      </div>

                      {/* Add Skill Form (Edit Mode) */}
                      {editMode && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Skill name"
                            className="flex-1 border rounded p-2"
                          />
                          <input
                            type="number"
                            value={newSkillPrice}
                            onChange={(e) => setNewSkillPrice(e.target.value)}
                            placeholder="Price per hour"
                            className="w-24 border rounded p-2"
                            min="0"
                            step="0.01"
                          />
                          <button
                            onClick={handleAddSkill}
                            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            <FiPlusCircle className="mr-1" /> Add
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Availability Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiCalendar className="mr-2" /> Availability
                      </h3>
                      {editMode ? (
                        <select
                          name="availability"
                          value={formData.availability || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full"
                        >
                          <option value="">Select availability</option>
                          <option value="Weekdays, 9am-5pm">
                            Weekdays, 9am-5pm
                          </option>
                          <option value="Weekends only">Weekends only</option>
                          <option value="Flexible hours">Flexible hours</option>
                        </select>
                      ) : (
                        <p className="text-gray-600">
                          {profile.availability || "No availability set"}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Learner-Specific Sections */}
                {!isCurrentUserMentor && (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiStar className="mr-2" /> Learning Stats
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <p className="text-sm text-indigo-800">
                            Sessions Booked
                          </p>
                          <p className="text-2xl font-bold">
                            {profile.sessionCount || 0}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-800">
                            Skills Learned
                          </p>
                          <p className="text-2xl font-bold">
                            {profile.skillsLearned?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Top Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.topSkills?.length > 0 ? (
                          profile.topSkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill.name}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills tracked yet</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Save Button in Edit Mode */}
          {editMode && (
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section for Mentors */}
        {isCurrentUserMentor &&
          reviews?.length > 0 && ( // Use separate 'reviews' state
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Student Reviews
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          size={18}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-2">"{review.comment}"</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>- {review.student_name}</span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Become Mentor Option for Learners */}
        {!isCurrentUserMentor && (
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Become a Mentor
              </h3>
              <p className="text-gray-600 mb-4">
                Share your knowledge and earn money by mentoring others
              </p>
              <button
                onClick={handleBecomeMentor}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply Now <FiChevronRight className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
