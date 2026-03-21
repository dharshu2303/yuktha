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



  const prompt = `You are an expert data extractor. Generate business details based on the provided inputs.

Extract the following from the provided card and/or user-provided context:
- name (person or business name)
- business (type of business)
- designation (job title if any)
- phone (with country code if visible)
- email
- address
- services (list of 4-6 specific services or products)
- tagline (a catchy 1-sentence business slogan or tagline based on the services)

${voiceText ? `Additional business details provided by the owner: "${voiceText}"` : ""}

Generate two versions of this data:
1. previewData: All fields completely translated into ${langName} for the user. CRITICAL REQUIREMENT: The previewData MUST be 100% in ${langName} without a single English word by any chance. Translate every business term, service, and tagline strictly to ${langName}.
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
    "tagline": ""
  },
  "publishedData": {
    "name": "",
    "business": "",
    "designation": "",
    "phone": "",
    "email": "",
    "address": "",
    "services": [],
    "tagline": ""
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

  const prompt = `You are a web developer. The user wants to modify their website. 

Current website data (for preview in ${langName}):
${JSON.stringify(previewData, null, 2)}

Current website data (for publication in English):
${JSON.stringify(publishedData, null, 2)}

User's instruction (in ${langName}):
"${userMessage}"

Apply the requested changes to BOTH data objects. CRITICAL REQUIREMENT: Ensure the updatedPreviewData remains 100% in ${langName} without a single English word by any chance. The updatedPublishedData must remain in professional English.

Also provide a brief confirmation message in ${langName} describing what you changed.

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
