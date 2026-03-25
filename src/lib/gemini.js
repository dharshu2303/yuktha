import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildModernTemplate } from "./templateEngine";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LANGUAGE_NAMES = {
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
  en: "English",
};

// Models to try in order (fallback chain)
// gemini-2.5-flash has best free tier: 500 RPM, 1M tokens
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];


async function callWithRetry(fn, maxRetries = 3) {
  for (let modelIdx = 0; modelIdx < MODEL_CHAIN.length; modelIdx++) {
    const modelName = MODEL_CHAIN[modelIdx];
    
    // Configure model — disable thinking for 2.5 models to save tokens
    const config = { model: modelName };
    if (modelName.includes("2.5")) {
      config.generationConfig = {
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 },
      };
    }
    const model = genAI.getGenerativeModel(config);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn(model);
      } catch (error) {
        const is429 = error.status === 429 ||
          error.message?.includes("429") ||
          error.message?.includes("quota") ||
          error.message?.includes("RESOURCE_EXHAUSTED");

        const is404 = error.status === 404 ||
          error.message?.includes("404") ||
          error.message?.includes("not found");

        // If model not found, skip to next model immediately
        if (is404) {
          console.warn(`Model ${modelName} not found, trying next model...`);
          break;
        }

        // If rate limited, wait and retry
        if (is429) {
          const waitTime = Math.min(Math.pow(2, attempt + 1) * 5000, 30000);
          console.warn(
            `Rate limited on ${modelName} (attempt ${attempt + 1}/${maxRetries}), waiting ${waitTime / 1000}s...`
          );

          // If this is the last attempt on the last model, throw
          if (attempt === maxRetries - 1 && modelIdx === MODEL_CHAIN.length - 1) {
            throw error;
          }

          // If last attempt on this model, try next model
          if (attempt === maxRetries - 1) {
            console.warn(`Exhausted retries on ${modelName}, trying next model...`);
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // For non-retryable errors, throw immediately
        throw error;
      }
    }
  }
  throw new Error("All models and retries exhausted. Please try again later.");
}

/**
 * Generate website content from a business card image
 * Returns both preview (user's language) and published (English) versions
 */
export async function generateFromCard(imageBase64, voiceText, language) {
  const langName = LANGUAGE_NAMES[language] || "English";



  const prompt = `You are an expert data extractor and business analyst. Generate business details based on the provided inputs.

Extract the following from the provided card and/or user-provided context:
- name: CRITICAL — Look for the LARGEST and MOST PROMINENT text in the center or top of the card that represents the main shop/company title (e.g., "SVNL Events"). Do NOT extract small corner text like authorizer names (e.g., "M. Yogi") as the main business name.
- business (type of business)
- designation (job title if any)
- phone (with country code if visible)
- email
- address
- services (list of 4-6 specific services or products)
- tagline (a catchy 1-sentence business slogan or tagline based on the services)
- about (a professional 2-3 sentence 'About Us' description of the business)
- faqs (an array of exactly 3 relevant 'Frequently Asked Questions' with detailed answers)
- testimonials: CRITICAL — Search your training data for REAL reviews of this EXACT business from JustDial (justdial.com), Google Maps, or Google Business. Match by business name AND city/area. If you find real verifiable reviews from JustDial or Google, include up to 2 with the exact reviewer name and review text. If you CANNOT find real reviews for this specific business, return an EMPTY ARRAY []. DO NOT fabricate or generate fake reviews under any circumstances.
- theme (an object with 'name' like "dark", "elegant", "vibrant" and 'primaryColor' HEX string tailored to the business brand — choose a color that matches the business industry)
- images: CRITICAL — Provide an array of exactly 3 HIGHLY SPECIFIC keywords describing visually the core services or products (e.g., if it's "SVNL Events", use "wedding decorations", "corporate event stage", "catering buffet"). Do NOT use generic terms like "business", "professional", or the company name itself. These keywords will fetch related stock photos.

${voiceText ? `Additional business details provided by the owner: "${voiceText}"` : ""}

Generate two versions of this data:
1. previewData: All fields completely translated into ${langName} for the user. CRITICAL REQUIREMENT: The previewData MUST be 100% in ${langName} without a single English word by any chance. If the provided card or context is in a language different from ${langName} (e.g., Tamil but requested ${langName} is Malayalam), you MUST translate all extracted content from the source language into ${langName}. Translate every business term, service, and tagline strictly to ${langName}.
2. publishedData: All fields in professional English for the public website.

Respond ONLY with valid JSON in this exact format (no markdown or thinking):
{
  "previewData": {
    "name": "",
    "business": "",
    "designation": "",
    "phone": "",
    "email": "",
    "address": "",
    "services": [],
    "tagline": "",
    "about": "",
    "faqs": [{"question": "", "answer": ""}],
    "testimonials": [{"name": "", "text": ""}],
    "theme": {"name": "", "primaryColor": ""},
    "images": []
  },
  "publishedData": {
    "name": "",
    "business": "",
    "designation": "",
    "phone": "",
    "email": "",
    "address": "",
    "services": [],
    "tagline": "",
    "about": "",
    "faqs": [{"question": "", "answer": ""}],
    "testimonials": [{"name": "", "text": ""}],
    "theme": {"name": "", "primaryColor": ""},
    "images": []
  },
  "metaTags": {
    "title": "",
    "description": "",
    "keywords": ""
  }
}`;

  const requestParts = [prompt];

  if (imageBase64) {
    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;
    const mimeMatch = imageBase64.match(/data:(image\/\w+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    
    requestParts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  const result = await callWithRetry(async (model) => {
    return await model.generateContent(requestParts);
  });

  const response = await result.response;
  let text = response.text();

  // Clean up response — robust JSON extraction
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("Gemini response did not contain JSON:", text);
    throw new Error("Failed to parse AI response: No JSON found");
  }

  const jsonString = text.substring(jsonStart, jsonEnd + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    console.error(
      "Failed to parse Gemini response:",
      jsonString.substring(0, 200)
    );
    throw new Error("Failed to parse AI response: Invalid JSON");
  }

  // Use Hybrid Template Engine to assemble HTML instantly
  const previewContent = buildModernTemplate(parsed.previewData, true, langName);
  const publishedContent = buildModernTemplate(parsed.publishedData, false, 'English');

  return {
    ...parsed,
    previewContent,
    publishedContent,
  };
}

/**
 * Refine website content based on user instruction
 * Returns updated preview (user's language) and published (English) versions
 */
export async function refineContent(previewData, publishedData, userMessage, language) {
  const langName = LANGUAGE_NAMES[language] || "English";

  const prompt = `You are a precise web developer assistant. The user wants to modify their business website. Read their instruction carefully and make EXACTLY the changes they ask for — nothing more, nothing less.

Current website data (for preview in ${langName}):
${JSON.stringify(previewData, null, 2)}

Current website data (for publication in English):
${JSON.stringify(publishedData, null, 2)}

User's instruction:
"${userMessage}"

IMPORTANT RULES:
1. Apply the requested changes to BOTH data objects (preview + published).
2. Keep ALL unchanged fields exactly as they are — do not modify, rewrite, or rephrase anything the user didn't ask to change.
3. If the user asks to change specific text like a tagline, service name, or about section, update ONLY that specific field.
4. If the user asks to add something, add it without removing existing content.
5. Ensure updatedPreviewData remains 100% in ${langName}. The updatedPublishedData must remain in professional English.
6. Provide a brief, friendly confirmation message in ${langName} that specifically describes what you changed (e.g., "I updated your tagline to...").

Respond ONLY with valid JSON in this exact format (no markdown or thinking):
{
  "updatedPreviewData": { ... },
  "updatedPublishedData": { ... },
  "aiMessage": "brief confirmation in ${langName}"
}`;

  const result = await callWithRetry(async (model) => {
    return await model.generateContent(prompt);
  });

  const response = await result.response;
  let text = response.text();

  // Clean up response — robust JSON extraction
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("Gemini response did not contain JSON:", text);
    throw new Error("Failed to parse AI response: No JSON found");
  }

  const jsonString = text.substring(jsonStart, jsonEnd + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    console.error(
      "Failed to parse Gemini refine response:",
      jsonString.substring(0, 200)
    );
    throw new Error("Failed to parse AI response: Invalid JSON");
  }

  // Use Hybrid Template Engine to rebuild HTML
  const updatedPreviewContent = buildModernTemplate(parsed.updatedPreviewData, true, langName);
  const updatedPublishedContent = buildModernTemplate(parsed.updatedPublishedData, false, 'English');

  return {
    ...parsed,
    updatedPreviewContent,
    updatedPublishedContent,
  };
}
