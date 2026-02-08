// src/pages/InterviewPrep.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import axiosInstance from "../utils/axiosInstance.js";
import API_PATHS from "../utils/apiPaths.js";
import QuestionCard from "../components/Cards/QuestionCard.jsx";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  // Fetch session + its saved questions
  const fetchSessionDetails = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      // depending on your API shape:
      setSessionData(res.data.data || res.data.session);
    } catch (err) {
      toast.error("Failed to load session");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate (or regenerate) questions: AI -> then save to session
  const generateQuestions = async () => {
    if (!sessionData) return;
    setWorking(true);
    const toastId = toast.loading("Generating questions...");
    try {
      // 1) Ask AI for Q&A JSON array
      const aiRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData.role,
        experience: sessionData.experience,
        topicsToFocus: sessionData.topicsToFocus,
        numberOfQuestions: 3,
      });
      const generated = aiRes.data.questions;
      if (!Array.isArray(generated)) {
        throw new Error("AI returned bad format");
      }

      // 2) Persist those questions under this session
      await axiosInstance.post(API_PATHS.QUESTION.ADD, {
        sessionId,
        questions: generated,
      });

      toast.success("Questions generated and saved!", { id: toastId });
      await fetchSessionDetails();
    } catch (err) {
      toast.error("Failed to generate questions", { id: toastId });
      console.error("generateQuestions error:", err);
    } finally {
      setWorking(false);
    }
  };

  // Pin/unpin, explain, note update as before...
  const handleTogglePin = async (qid) => {
    try {
      await axiosInstance.post(API_PATHS.QUESTION.TOGGLE_PIN(qid));
      await fetchSessionDetails();
    } catch (e) {
      toast.error("Pin toggle failed");
    }
  };

  const handleExplain = async (qid) => {
    setWorking(true);
    const toastId = toast.loading("Generating explanation...");
    try {
      const questionObj = sessionData.questions.find((q) => q._id === qid);

      if (!questionObj || !questionObj.question) {
        throw new Error("Question text not found for explanation.");
      }

      await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        questionId: qid,
        question: questionObj.question,
      });

      toast.success("Explanation added!", { id: toastId });
      await fetchSessionDetails();
    } catch (e) {
      toast.error("Failed to generate explanation", { id: toastId });
      console.error("handleExplain error:", e);
    } finally {
      setWorking(false);
    }
  };

  const handleNoteUpdate = async (qid, note) => {
    try {
      await axiosInstance.post(API_PATHS.QUESTION.UPDATE_NOTE(qid), { note });
      toast.success("Note saved");
      await fetchSessionDetails();
    } catch (e) {
      toast.error("Note save failed");
    }
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!sessionData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Session not found</h2>
            <Link to="/dashboard" className="text-indigo-600 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasQs = sessionData?.questions?.length > 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6">
        <div className="container mx-auto max-w-5xl">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>

          {/* Session Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {sessionData.role}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {sessionData.experience}
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {sessionData.topicsToFocus}
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Last updated {moment(sessionData.updatedAt).format("Do MMM YYYY")}
              </span>
            </div>

            {sessionData.description && (
              <p className="text-gray-600 mb-4">{sessionData.description}</p>
            )}

            <button
              onClick={generateQuestions}
              disabled={working}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {working ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Generate More Questions
                </>
              )}
            </button>
          </div>

          {/* Questions Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Questions ({sessionData?.questions?.length || 0})
            </h2>

            {!hasQs ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No questions yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Click "Generate More Questions" to get started with AI-generated
                  interview questions.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {sessionData.questions.map((q) => (
                  <li key={q._id}>
                    <QuestionCard
                      question={q.question}
                      answer={q.answer}
                      note={q.note}
                      isPinned={q.isPinned}
                      onPin={() => handleTogglePin(q._id)}
                      onExplain={() => handleExplain(q._id)}
                      onUpdateNote={(n) => handleNoteUpdate(q._id, n)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
