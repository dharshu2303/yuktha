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
const MODEL_CHAIN = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
];

/**
 * Retry wrapper with exponential backoff and model fallback
 */
async function callWithRetry(fn, maxRetries = 3) {
  for (let modelIdx = 0; modelIdx < MODEL_CHAIN.length; modelIdx++) {
    const modelName = MODEL_CHAIN[modelIdx];
    const model = genAI.getGenerativeModel({ model: modelName });

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
          const waitTime = Math.min(Math.pow(2, attempt + 1) * 15000, 65000);
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

  // Remove data URL prefix if present
  const base64Data = imageBase64.includes(",")
    ? imageBase64.split(",")[1]
    : imageBase64;

  const mimeMatch = imageBase64.match(/data:(image\/\w+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

  const prompt = `You are an expert data extractor. Analyze this business card image and extract the details.

Extract the following from the card:
- name (person or business name)
- business (type of business)
- designation (job title if any)
- phone (with country code if visible)
- email
- address
- services (list of services or products)

${voiceText ? `Additional business details provided by the owner: "${voiceText}"` : ""}

Translate all the extracted text into ${langName} language for the user.

Respond ONLY with valid JSON in this exact format (no markdown or thinking):
{
  "extractedData": {
    "name": "",
    "business": "",
    "designation": "",
    "phone": "",
    "email": "",
    "address": "",
    "services": []
  },
  "metaTags": {
    "title": "",
    "description": "",
    "keywords": ""
  }
}`;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const result = await callWithRetry(async (model) => {
    return await model.generateContent([prompt, imagePart]);
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

  // Use Hybrid Template Engine to assemble HTML instantly (saving tokens and API latency)
  const previewContent = buildModernTemplate(parsed.extractedData, true, langName);
  const publishedContent = buildModernTemplate(parsed.extractedData, false, 'English');

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
export async function refineContent(currentContent, userMessage, language) {
  const langName = LANGUAGE_NAMES[language] || "English";

  const prompt = `You are a web developer. The user wants to modify their website. 

Current website HTML (in ${langName}):
${currentContent}

User's instruction (in ${langName}):
"${userMessage}"

Apply the requested changes and return the updated website. Generate TWO versions:
1. updatedPreviewContent: Updated HTML in ${langName} (for the owner to preview)
2. updatedPublishedContent: Updated HTML in professional English (for the live published site)

Also provide a brief confirmation message in ${langName} describing what you changed.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "updatedPreviewContent": "<complete updated HTML in ${langName}>",
  "updatedPublishedContent": "<complete updated HTML in English>",
  "aiMessage": "<brief confirmation in ${langName}>"
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

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(
      "Failed to parse Gemini refine response:",
      jsonString.substring(0, 200)
    );
    throw new Error("Failed to parse AI response: Invalid JSON");
  }
}
