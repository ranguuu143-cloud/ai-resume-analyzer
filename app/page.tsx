"use client";
import { useState } from "react";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resumeText || !jobDesc) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription: jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    result?.matchScore >= 70
      ? "text-green-600"
      : result?.matchScore >= 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          AI Resume Analyzer
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Paste your resume and job description to get an AI-powered match analysis
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Your Resume (paste as text)
            </label>
            <textarea
              className="w-full h-56 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              className="w-full h-56 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}
        <div className="text-center mb-8">
          <button
            onClick={analyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
        {result && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm uppercase tracking-wide">Match Score</p>
              <p className={`text-6xl font-bold ${scoreColor}`}>{result.matchScore}%</p>
              <p className="text-gray-600 mt-2 text-sm">{result.summary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-700 mb-2">✅ Strengths</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  {result.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-bold text-red-700 mb-2">❌ Missing Skills</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  {result.missingSkills?.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-700 mb-2">💡 Suggestions</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {result.suggestions?.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}