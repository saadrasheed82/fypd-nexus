const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

function extractJson(content) {
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {}

  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function normalizeMilestones(milestones, months) {
  if (!Array.isArray(milestones)) return null;

  const normalized = milestones.slice(0, months).map((milestone, index) => ({
    monthNumber: Number(milestone.monthNumber) || index + 1,
    title: String(milestone.title || `Project Phase ${index + 1}`).slice(0, 90),
    description: `Month ${Number(milestone.monthNumber) || index + 1}: ${String(
      milestone.description || "Complete the planned project work for this phase."
    )} Upload a screenshot and screen recording when complete.`,
  }));

  return normalized.length === months ? normalized : null;
}

export async function generateMilestonesWithAI(projectText, months = 6) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const prompt = `Analyze this final year project and create exactly ${months} project milestones.

Project details:
${projectText}

Rules:
- Every milestone must be specific to this exact project, not generic.
- Use the project's domain, features, users, and tech stack.
- Make each month actionable and measurable.
- Return only JSON with this shape:
{
  "milestones": [
    {
      "monthNumber": 1,
      "title": "Short project-specific milestone title",
      "description": "Specific deliverables for this month."
    }
  ]
}`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert software project manager. You create project-specific monthly milestones from student project proposals.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 1600,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI-compatible API error:", response.status, errorText);
      return null;
    }

    const rawText = await response.text();
    
    let data;
    if (rawText.startsWith("data: ")) {
      const lines = rawText.split("\n").filter(line => line.startsWith("data: ") && !line.includes("[DONE]"));
      const lastDataLine = lines[lines.length - 1];
      const jsonStr = lastDataLine.replace(/^data: /, "").trim();
      data = JSON.parse(jsonStr);
    } else {
      data = JSON.parse(rawText);
    }
    
    const content = data.choices?.[0]?.message?.content;
    const parsed = extractJson(content);
    return normalizeMilestones(parsed?.milestones, months);
  } catch (error) {
    console.error("AI milestone generation failed:", error);
    return null;
  }
}

export function isAIEnabled() {
  return Boolean(process.env.OPENAI_API_KEY);
}
