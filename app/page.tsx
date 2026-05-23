"use client";

import { useState } from "react";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<any>(null);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDesc,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.matchScore >= 70
      ? "text-green-600"
      : result.matchScore >= 40
      ? "text-yellow-500"
      : "text-red-500"
    : "text-gray-500";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        <div className="bg-white shadow-2xl rounded-3xl p-8">

          <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-3">
            AI Resume Analyzer
          </h1>

          <p className="text-center text-gray-700 text-lg mb-10">
            Compare your resume with job descriptions using AI-powered analysis
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Your Resume
              </label>

              <textarea
                className="w-full h-72 border-2 border-gray-300 rounded-2xl p-4 text-gray-900 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
                placeholder="Paste your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Job Description
              </label>

              <textarea
                className="w-full h-72 border-2 border-gray-300 rounded-2xl p-4 text-gray-900 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-300"
                placeholder="Paste job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl text-center mb-6 font-medium">
              {error}
            </div>
          )}

          <div className="text-center mb-10">

            <button
              onClick={analyze}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

          </div>

          {result && (

            <div className="bg-gray-50 rounded-3xl shadow-inner p-8">

              <div className="text-center mb-10">

                <p className="text-gray-600 uppercase tracking-wider text-sm font-semibold">
                  Match Score
                </p>

                <p className={`text-7xl font-extrabold ${scoreColor}`}>
                  {result.matchScore}%
                </p>

                <p className="text-gray-800 text-lg mt-4 leading-relaxed max-w-3xl mx-auto font-medium">
                  {result.summary}
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-green-100 border border-green-300 rounded-2xl p-6 shadow-sm">

                  <h2 className="text-2xl font-bold text-green-800 mb-4">
                    ✅ Strengths
                  </h2>

                  <ul className="space-y-3 text-gray-900 text-sm font-medium leading-relaxed">
                    {result.strengths?.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>

                </div>

                <div className="bg-red-100 border border-red-300 rounded-2xl p-6 shadow-sm">

                  <h2 className="text-2xl font-bold text-red-800 mb-4">
                    ❌ Missing Skills
                  </h2>

                  <ul className="space-y-3 text-gray-900 text-sm font-medium leading-relaxed">
                    {result.missingSkills?.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>

                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-2xl p-6 shadow-sm">

                  <h2 className="text-2xl font-bold text-blue-800 mb-4">
                    💡 Suggestions
                  </h2>

                  <ul className="space-y-3 text-gray-900 text-sm font-medium leading-relaxed">
                    {result.suggestions?.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}