import { questionAnswerPrompt, conceptExplainPrompt } from "../utils/prompt.js";
import dotenv from "dotenv";
import Question from "../models/QuestionModel.js";
dotenv.config();

// OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY;

// Helper function to call OpenRouter API
const callOpenRouter = async (prompt) => {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5001",
      "X-Title": "Interview Prep AI"
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-lite-001",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
};

// Attempts to parse a string as JSON, with fallback for common formatting issues
const tryParseJSON = (text) => {
  try {
    return { json: JSON.parse(text), error: null };
  } catch (err) {
    // Clean up common formatting issues (e.g., ```json ... ```)
    let cleaned = text
      .replace(/^```json\s*/i, "") // remove starting ```json
      .replace(/^```\s*/i, "") // remove starting ```
      .replace(/```\s*$/i, "") // remove ending ```
      .trim();
    try {
      return { json: JSON.parse(cleaned), error: null };
    } catch (err2) {
      return { json: null, error: err2.message };
    }
  }
};

// @desc    Generate interview questions and answers using OpenRouter
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    // Validate required fields
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build prompt
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    // Call OpenRouter API
    const text = await callOpenRouter(prompt);

    if (!text) {
      return res.status(500).json({ message: "No response from AI" });
    }

    const { json, error } = tryParseJSON(text);

    if (json) {
      res.status(200).json({ questions: json });
    } else {
      res.status(500).json({
        message: "AI did not return valid JSON",
        raw: text,
        error,
      });
    }
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for an interview question using OpenRouter
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { questionId, question } = req.body;

    // Validate required field
    if (!questionId || !question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build prompt
    const prompt = conceptExplainPrompt(question);

    // Call OpenRouter API
    const text = await callOpenRouter(prompt);

    if (!text) {
      return res.status(500).json({ message: "No response from AI" });
    }

    const { json, error } = tryParseJSON(text);
    
    let explanation = "";

    if (json && typeof json === "object") {
      if (typeof json.explanation === "string") {
        explanation = json.explanation;
      } else {
        explanation = JSON.stringify(json);
      }
    } else {
      explanation = text;
    }

    const existingQuestion = await Question.findById(questionId);

    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newAnswer = `${existingQuestion.answer || ""}\n\nExplanation:\n${explanation}`;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer: newAnswer },
      { new: true }
    );

    return res.status(200).json({ question: updatedQuestion });
  } catch (error) {
    console.error("Generate explanation error:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

export { generateInterviewQuestions, generateConceptExplanation };
