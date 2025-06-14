import { useState, useEffect } from "react";
import { getUser, isMentor } from "../utils/auth";
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

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [newSkillPrice, setNewSkillPrice] = useState("");
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const dummyProfile = {
        fullName: user.username || "John Doe",
        email: user.email || "john.doe@example.com",
        bio: isMentor()
          ? "Experienced software engineer with 5+ years of experience in web development. Passionate about teaching and helping others grow."
          : "Aspiring developer eager to learn new technologies and improve coding skills.",
        role: isMentor() ? "mentor" : "learner",
        skills: isMentor()
          ? [
              { id: 1, name: "React", price: 50 },
              { id: 2, name: "JavaScript", price: 45 },
              { id: 3, name: "Node.js", price: 55 },
            ]
          : [],
        reviews: isMentor()
          ? [
              {
                id: 1,
                rating: 5,
                comment:
                  "Great mentor! Explained complex concepts in an easy-to-understand way.",
                studentName: "Alice Johnson",
                date: "2023-06-15",
              },
              {
                id: 2,
                rating: 4,
                comment: "Very knowledgeable and patient. Would recommend!",
                studentName: "Bob Smith",
                date: "2023-05-22",
              },
            ]
          : [],
        sessionCount: isMentor() ? 12 : 5,
        skillsLearned: isMentor()
          ? []
          : [
              { id: 1, name: "React Fundamentals" },
              { id: 2, name: "JavaScript ES6+" },
              { id: 3, name: "CSS Grid" },
            ],
        topSkills: isMentor()
          ? []
          : [
              { id: 1, name: "JavaScript" },
              { id: 2, name: "React" },
              { id: 3, name: "HTML/CSS" },
            ],
        availability: isMentor() ? "Weekdays, 9am-5pm" : null,
      };

      setProfile(dummyProfile);
      setFormData(dummyProfile);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setProfile(formData);
      setEditMode(false);
      toast.success("Profile updated successfully (simulated)");
    }, 500);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    // Simulate API call
    setTimeout(() => {
      const newSkillObj = {
        id: Math.max(0, ...profile.skills.map((s) => s.id)) + 1,
        name: newSkill,
        price: Number(newSkillPrice) || 0,
      };

      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkillObj],
      }));
      setNewSkill("");
      setNewSkillPrice("");
      toast.success("Skill added (simulated)");
    }, 300);
  };

  const handleRemoveSkill = (skillId) => {
    // Simulate API call
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        skills: prev.skills.filter((skill) => skill.id !== skillId),
      }));
      toast.success("Skill removed (simulated)");
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12">Failed to load profile</div>;
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
                  {editMode ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="text-xl font-bold text-center mb-1 border rounded p-1 w-full"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile.fullName}
                    </h2>
                  )}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mt-2">
                    {isMentor() ? "Mentor" : "Learner"}
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

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Email
                    </h3>
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-2" />
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border rounded p-1 flex-1"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mentor-Specific Sections */}
                {isMentor() && (
                  <>
                    {/* Skills Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiAward className="mr-2" /> Skills Offered
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profile.skills?.length > 0 ? (
                          profile.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill.name}
                              {skill.price > 0 && (
                                <span className="ml-1">
                                  (${skill.price}/hr)
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
                {!isMentor() && (
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
        {isMentor() && profile.reviews?.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Student Reviews
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {profile.reviews.map((review) => (
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
                    <span>- {review.studentName}</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Become Mentor Option for Learners */}
        {!isMentor() && (
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Become a Mentor
              </h3>
              <p className="text-gray-600 mb-4">
                Share your knowledge and earn money by mentoring others
              </p>
              <button
                onClick={() => navigate("/become-mentor")}
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
