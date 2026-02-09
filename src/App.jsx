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
        "Text is too short to summarize. Please enter at least 50 characters."
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
      className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 -right-48 w-[32rem] h-[32rem] bg-purple-500/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute -bottom-48 -left-48 w-[32rem] h-[32rem] bg-blue-500/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-[32rem] h-[32rem] bg-pink-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <IoSparkles className="text-5xl text-purple-300 animate-pulse hidden sm:block" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              AI Text Summarizer
            </h1>
            <IoSparkles className="text-5xl text-pink-300 animate-pulse hidden sm:block" />
          </div>
          <p className="text-xl md:text-2xl text-purple-200 font-light">
            Powered by Google Gemini AI
          </p>
          <p className="text-sm text-purple-300/60 mt-2">
            Turn long content into clear, concise summaries instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.25)] max-w-5xl mx-auto border border-white/20 rounded-3xl">
          <div className="card-body p-8 md:p-12">
            {/* Input */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <label className="text-xl font-bold text-white">
                  📝 Enter your text
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="badge bg-white/10 text-white border border-white/20">
                    {countWords(text)}{" "}
                    {pluralize(countWords(text), "word", "words")} •{" "}
                    {countSentences(text)}{" "}
                    {pluralize(
                      countSentences(text),
                      "sentence",
                      "sentences"
                    )}
                  </div>
                  <button
                    onClick={pasteText}
                    disabled={loading}
                    className="btn btn-sm md:btn-md bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 active:scale-95 text-white border-0 rounded-xl transition-all"
                  >
                    <HiClipboard className="w-5 h-5" />
                    Paste
                  </button>
                </div>
              </div>

              <textarea
                className="textarea w-full h-56 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-2xl focus:ring-4 focus:ring-purple-400/30 transition-all shadow-inner"
                placeholder="Paste your article, blog, or any long text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="alert bg-red-500/20 border border-red-400/50 rounded-xl mb-6">
                <HiExclamationCircle className="w-6 h-6 text-red-300" />
                <span className="text-red-100">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 mb-8">
              <button
                onClick={clearAll}
                disabled={loading}
                className="btn bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white border border-white/20 rounded-xl transition-all"
              >
                Clear
              </button>

              <button
                onClick={summarizeText}
                disabled={loading}
                className="btn bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 hover:scale-105 active:scale-95 text-white border-0 gap-2 rounded-xl shadow-xl transition-all"
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

            {/* Summary */}
            {summary && (
              <>
                <div className="divider my-10 opacity-30" />

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                      ✅ Summary
                    </h2>

                    <button
                      onClick={copyToClipboard}
                      className="btn btn-sm md:btn-md bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 active:scale-95 text-white border-0 gap-2 rounded-xl transition-all"
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

                  <div className="bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-400/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.25)]">
                    <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-purple-200/50 text-sm tracking-wide">
            Built with React • Tailwind • DaisyUI • Google Gemini ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
