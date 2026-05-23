import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a professional resume analyzer. Analyze this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a JSON response with exactly this structure:
{
  "matchScore": <number 0-100>,
  "strengths": [<list of 3-5 matching strengths>],
  "missingSkills": [<list of skills in JD but missing in resume>],
  "suggestions": [<list of 3-5 specific improvement suggestions>],
  "summary": "<2 sentence overall summary>"
}

Return ONLY the JSON object, no extra text, no markdown, no backticks.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rawText = completion.choices[0].message.content.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analysis error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}