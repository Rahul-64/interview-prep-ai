import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../components/auth/LoginPopup.jsx";
import SignupPopup from "../components/auth/SignupPopup.jsx";
import { UserContext } from "../context/userContext.jsx";
import logo from "../assets/hero-img.png";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Handle switching between login and signup
  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-200 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-200 to-indigo-100
 flex flex-col items-center justify-center p-6"
    >
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-10">
        <div className="text-2xl font-bold text-indigo-700">
          InterviewPrep.AI
        </div>
        <div className="space-x-3">
          <button
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium shadow hover:shadow-md transition-shadow"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors"
            onClick={() => setShowSignup(true)}
          >
            SignUp
          </button>
        </div>
      </header>

      {/* Hero image */}
      <img
        src={logo}
        alt="Hero"
        className="w-full max-w-xs sm:max-w-md mb-8 drop-shadow-lg"
      />

      {/* Hero text */}
      <main className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Ace Interviews with AI-Powered Learning
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Generate personalized interview questions, take notes, and review
          technical concepts - all powered by AI and tailored to your role and
          experience.
        </p>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors"
          onClick={() => setShowSignup(true)}
        >
          Get Started
        </button>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Questions</h3>
          <p className="text-gray-600 text-sm">
            Get personalized interview questions based on your role, experience level, and focus areas.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Notes</h3>
          <p className="text-gray-600 text-sm">
            Add your own notes to questions and pin important ones for quick review.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Concept Explanations</h3>
          <p className="text-gray-600 text-sm">
            Get detailed, beginner-friendly explanations for any technical concept.
          </p>
        </div>
      </section>

      {/* Popups */}
      {showLogin && (
        <LoginPopup 
          onClose={() => setShowLogin(false)} 
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}
      {showSignup && (
        <SignupPopup 
          onClose={() => setShowSignup(false)} 
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
}
