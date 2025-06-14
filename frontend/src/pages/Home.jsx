import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
              Forge Your Skills with Expert Mentors
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Personalized 1-on-1 learning sessions to help you master new skills
            or share your expertise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/skills"
                className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-lg"
              >
                Browse Skills <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register?role=mentor"
                className="flex items-center justify-center gap-2 bg-indigo-600 bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 border border-indigo-300 border-opacity-50"
              >
                Become a Learner <SparklesIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How <span className="text-indigo-600">SkillForge</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to start your learning journey or share your
              knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <AcademicCapIcon className="w-12 h-12 text-indigo-600 mx-auto" />
                ),
                title: "Discover Skills",
                description:
                  "Browse our diverse catalog of skills and find the perfect mentor for your goals.",
                bg: "bg-indigo-50",
              },
              {
                icon: (
                  <CalendarIcon className="w-12 h-12 text-indigo-600 mx-auto" />
                ),
                title: "Book Sessions",
                description:
                  "Schedule 1-on-1 sessions at times that work for both you and the mentor.",
                bg: "bg-purple-50",
              },
              {
                icon: (
                  <ChartBarIcon className="w-12 h-12 text-indigo-600 mx-auto" />
                ),
                title: "Grow Together",
                description:
                  "Learn interactively, get personalized feedback, and track your progress.",
                bg: "bg-blue-50",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${item.bg} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300`}
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Popular <span className="text-indigo-600">Skills</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trending skills our community is learning right now
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "React Development",
                mentor: "Sarah Johnson",
                description:
                  "Master React hooks, context API, and modern best practices.",
                price: "$45/session",
              },
              {
                title: "UI/UX Design",
                mentor: "Alex Chen",
                description:
                  "Learn Figma, user research, and interaction design principles.",
                price: "$55/session",
              },
              {
                title: "Data Science",
                mentor: "Dr. Michael Wong",
                description:
                  "Python, Pandas, and machine learning fundamentals.",
                price: "$60/session",
              },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {skill.title}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {skill.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Mentor: {skill.mentor}
                  </p>
                  <p className="text-gray-700 mb-6">{skill.description}</p>
                  <Link
                    to={`/skills/${index}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View details
                    <ArrowRightIcon className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Featured <span className="text-indigo-600">Mentors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn from experienced professionals across various fields
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Dr. Emily Parker",
                role: "Machine Learning",
                skills: "Python, TensorFlow, NLP",
                rating: "4.9/5 (128 reviews)",
              },
              {
                name: "James Rodriguez",
                role: "Fullstack Development",
                skills: "JavaScript, Node.js, React",
                rating: "4.8/5 (96 reviews)",
              },
              {
                name: "Priya Patel",
                role: "Digital Marketing",
                skills: "SEO, Social Media, Analytics",
                rating: "4.7/5 (84 reviews)",
              },
              {
                name: "David Kim",
                role: "Product Management",
                skills: "Agile, UX, Roadmapping",
                rating: "4.9/5 (112 reviews)",
              },
            ].map((mentor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-indigo-600">
                      <UserGroupIcon className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-2">
                    {mentor.role}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{mentor.skills}</p>
                  <p className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full inline-block">
                    ★ {mentor.rating}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-indigo-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Success <span className="text-indigo-600">Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What our learners and mentors are saying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "My mentor helped me land my first developer job in just 3 months of sessions. The personalized guidance was invaluable!",
                author: "Taylor S.",
                role: "Junior Developer",
              },
              {
                quote:
                  "As a mentor, I love seeing my students grow. SkillForge makes it easy to connect with passionate learners.",
                author: "Marcus L.",
                role: "Senior UX Designer",
              },
              {
                quote:
                  "I went from complete beginner to building my own apps. The 1-on-1 format made all the difference.",
                author: "Aisha K.",
                role: "App Developer",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-indigo-500 text-4xl mb-4">"</div>
                <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and mentors building the future of
            education together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-lg"
              >
                Get Started <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/skills"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 border border-indigo-300 border-opacity-50"
              >
                Browse Skills <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                SkillForge
              </h3>
              <p className="text-sm">
                Connecting learners with expert mentors for personalized skill
                development.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                Learn
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/skills" className="hover:text-white transition">
                    Browse Skills
                  </Link>
                </li>
                <li>
                  <Link to="/mentors" className="hover:text-white transition">
                    Find Mentors
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                Teach
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register?role=mentor"
                    className="hover:text-white transition"
                  >
                    Become a Mentor
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mentor-guidelines"
                    className="hover:text-white transition"
                  >
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-white transition">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-sm text-center">
            &copy; {new Date().getFullYear()} SkillForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
