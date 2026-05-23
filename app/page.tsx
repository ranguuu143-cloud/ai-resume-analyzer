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
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          AI Resume Analyzer
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Paste your resume and job description to get AI-powered analysis
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Resume
            </label>

            <textarea
              className="w-full h-64 border border-gray-300 rounded-lg p-3"
              placeholder="Paste your resume..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Job Description
            </label>

            <textarea
              className="w-full h-64 border border-gray-300 rounded-lg p-3"
              placeholder="Paste job description..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <div className="text-center mb-8">
          <button
            onClick={analyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {result && (
          <div className="bg-white shadow-lg rounded-xl p-6">

            <div className="text-center mb-8">

              <p className="text-gray-500 uppercase text-sm">
                Match Score
              </p>

              <p className={`text-6xl font-bold ${scoreColor}`}>
                {result.matchScore}%
              </p>

              <p className="text-gray-600 mt-3">
                {result.summary}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="font-bold text-green-700 mb-2">
                  ✅ Strengths
                </h2>

                <ul className="space-y-2 text-sm">
                  {result.strengths?.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h2 className="font-bold text-red-700 mb-2">
                  ❌ Missing Skills
                </h2>

                <ul className="space-y-2 text-sm">
                  {result.missingSkills?.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="font-bold text-blue-700 mb-2">
                  💡 Suggestions
                </h2>

                <ul className="space-y-2 text-sm">
                  {result.suggestions?.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}