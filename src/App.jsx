import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { IoSparkles } from "react-icons/io5";
import {
  HiClipboard,
  HiExclamationCircle,
  HiPencilAlt,
  HiCheck,
} from "react-icons/hi";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const countWords = (str) => {
    return str
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const countSentences = (str) => {
    return str
      .trim()
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;
  };

  const pluralize = (count, singular, plural) => {
    return count === 1 ? singular : plural;
  };

  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (error) {
      console.error("Failed to paste: ", error);
      setError("Failed to paste text. You can try pasting it manually.");
    }
  };

  const summarizeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    if (text.trim().length < 50) {
      setError(
        "Text is too short to summarize. Please enter at least 50 characters.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:
          "Please provide a concise, one-sentence summary of the following text:\n\n" +
          text,
      });

      const responseText = response.text;
      console.log("AI Response: ", responseText);
      setSummary(responseText);
    } catch (err) {
      console.error("Summarization failed: ", err);
      setError(err.message || "An error occurred while summarizing the text.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
      setError("Failed to copy to clipboard. Please try again.");
    }
  };

  const clearAll = () => {
    setText("");
    setSummary("");
    setError(null);
    setCopied(false);
  };

  return (
    <div
      data-theme="light"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <IoSparkles className="text-5xl text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hidden sm:block animate-pulse" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              AI Text Summarizer
            </h1>
            <IoSparkles className="text-5xl text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hidden sm:block animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-purple-200 font-light tracking-wide mb-2">
            Powered by Google Gemini AI
          </p>
          <p className="text-sm text-purple-300/60">
            Transform lengthy content into concise summaries in seconds
          </p>
        </div>

        <div className="card bg-white/10 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto border border-white/20">
          <div className="card-body p-8 md:p-12">
            {/* Input Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <label className="text-xl font-bold text-white/90">
                  📝 Enter your text
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="tooltip"
                    data-tip={`${text.length} characters`}
                  >
                    <div className="badge badge-lg badge-ghost gap-2 bg-white/10 text-white border border-white/20 text-sm font-semibold">
                      {countWords(text)}{" "}
                      {pluralize(countWords(text), "word", "words")} •{" "}
                      {countSentences(text)}{" "}
                      {pluralize(countSentences(text), "sentence", "sentences")}
                    </div>
                  </div>
                  <button
                    onClick={pasteText}
                    className="btn btn-sm md:btn-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 gap-2 rounded-lg shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    <HiClipboard className="w-5 h-5" />
                    Paste
                  </button>
                </div>
              </div>
              <textarea
                className="textarea w-full h-56 text-base bg-white/5 border border-white/20 text-white placeholder-white/40 rounded-xl focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all duration-300"
                placeholder="Paste your article, blog post, or any long text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert bg-red-500/20 border border-red-400/50 rounded-xl mb-6 backdrop-blur-sm">
                <HiExclamationCircle className="w-6 h-6 text-red-300" />
                <span className="text-red-100">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mb-8">
              <button
                className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all duration-300"
                onClick={clearAll}
                disabled={loading}
              >
                Clear
              </button>
              <button
                className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 gap-2 rounded-lg shadow-lg transition-all duration-300"
                onClick={summarizeText}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Summarizing...
                  </>
                ) : (
                  <>
                    <HiPencilAlt className="w-5 h-5" />
                    Summarize
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            {summary && (
              <div className="divider bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>
            )}

            {/* Summary Section */}
            {summary && (
              <div className="fade-in-animation">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-white/90">✅</h2>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                      Summary
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div
                      className="tooltip"
                      data-tip={`${summary.length} characters`}
                    >
                      <div className="badge badge-lg badge-ghost gap-2 bg-white/10 text-white border border-white/20 text-sm font-semibold">
                        {countWords(summary)}{" "}
                        {pluralize(countWords(summary), "word", "words")} •{" "}
                        {countSentences(summary)}{" "}
                        {pluralize(
                          countSentences(summary),
                          "sentence",
                          "sentences",
                        )}
                      </div>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="btn btn-sm md:btn-md bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 gap-2 rounded-lg shadow-lg transition-all duration-300"
                    >
                      {copied ? (
                        <>
                          <HiCheck className="w-5 h-5" /> Copied!
                        </>
                      ) : (
                        <>
                          <HiClipboard className="w-5 h-5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                  <p className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap font-light">
                    {summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-purple-200/60 font-light text-sm md:text-base">
            Built with React, Tailwind CSS, Daisy UI, and Google Gemini API
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
