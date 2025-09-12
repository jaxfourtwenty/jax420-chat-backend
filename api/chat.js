import OpenAI from "openai";

// Allow simple CORS (add your domain below)
const ALLOWED_ORIGINS = [
  "https://jax420.com",
  "https://*.carrd.co"
];

// Utility CORS headers
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allow = ALLOWED_ORIGINS.some(p =>
    origin === p || (p.includes("*") && origin.endsWith(p.replace("*.", "")))
  );
  const headers = corsHeaders(allow ? origin : "*");

  if (req.method === "OPTIONS") {
    res.set(headers).status(204).send("");
    return;
  }

if (req.method === "OPTIONS") {
  for (const [k, v] of Object.entries(headers)) {
    res.setHeader(k, v);
  }
  res.status(204).end();
  return;
}

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      res.set(headers).status(400).json({ error: "Missing 'messages' array" });
      return;
    }

    // System guardrail for JAX 420 tone & safety
    const systemMsg = {
      role: "system",
      content:
        "You are a helpful, upbeat local assistant for JAX 420 in Jacksonville, FL. " +
        "Keep answers concise, family-friendly, and avoid banned words or price/sales language. " +
        "If unsure, direct users to JAX420.com."
    };

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Use Responses API for simplicity; you can switch models any time
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [systemMsg, ...messages]
    });

    const reply =
      response.output_text?.trim() ||
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "Sorry, I couldn’t generate a reply.";

    res.set(headers).status(200).json({ reply });
  } catch (err) {
    console.error(err);
    for (const [k, v] of Object.entries(headers)) {
  res.setHeader(k, v);
}
res.status(500).json({ error: "Server error." });

  }
}
