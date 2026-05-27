import fs from "fs";

let content = fs.readFileSync("server.ts", "utf8");

// We'll replace handleGeminiRequest
const newHandleGeminiRequest = `
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const generateWithRetry = async (model: string, prompt: string, config: any, retries = 3) => {
      let lastError = null;
      for (let i = 0; i < retries; i++) {
          try {
              if (!ai) throw new Error("Gemini AI client is not available.");
              return await ai.models.generateContent({
                  model: model,
                  contents: prompt,
                  config: config
              });
          } catch(err: any) {
              lastError = err;
              if (err.message && err.message.includes("503") || (err.message && err.message.includes("high demand"))) {
                  console.log(\`Retry \${i + 1} for \${model}...\`);
                  await sleep(2000 * (i + 1));
                  continue;
              }
              break;
          }
      }
      throw lastError;
  };

  const handleGeminiRequest = async (res: any, model: string, prompt: string, config: any) => {
    if (!ai) {
      return res.status(500).json({ message: "Gemini AI client is not available. Check GEMINI_API_KEY." });
    }
    try {
      const response = await generateWithRetry(model, prompt, config);
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error.message, error.stack);
      res.status(500).json({ message: "Error generating content from Gemini", error: error.message, stack: error.stack });
    }
  };
`;

content = content.replace(/  const handleGeminiRequest = async \(res: any, model: string, prompt: string, config: any\) => \{[\s\S]*?  \};/g, newHandleGeminiRequest);

// Also need to fix the custom generateContent calls for match-candidates, succession-insight, and employee-data
// Match candidates:
content = content.replace(/const response = await ai\.models\.generateContent\(\{[\s\S]*?config: \{[^]*?\}\s*\}\);/g, (match) => {
    return match.replace("ai.models.generateContent", "generateWithRetry");
});

// For generateWithRetry to work directly with the object, wait, `generateWithRetry` was defined to take (model, prompt, config).
// Let's define a general retry:
const generalRetry = `
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const buildGenerateWithRetry = () => {
      return async (params: any, retries = 3) => {
          let lastError = null;
          for (let i = 0; i < retries; i++) {
              try {
                  if (!ai) throw new Error("Gemini AI client is not available.");
                  return await ai.models.generateContent(params);
              } catch(err: any) {
                  lastError = err;
                  if (err.message && (err.message.includes("503") || err.message.includes("high demand"))) {
                      console.log(\`Retry \${i + 1} for \${params.model}...\`);
                      await sleep(2000 * (i + 1));
                      continue;
                  }
                  break;
              }
          }
          throw lastError;
      };
  };
  const generateContentWithRetry = buildGenerateWithRetry();

  const handleGeminiRequest = async (res: any, model: string, prompt: string, config: any) => {
    if (!ai) {
      return res.status(500).json({ message: "Gemini AI client is not available. Check GEMINI_API_KEY." });
    }
    try {
      const response = await generateContentWithRetry({ model, contents: prompt, config });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error.message);
      res.status(500).json({ message: "Error generating content from Gemini", error: error.message });
    }
  };
`;
fs.writeFileSync("update-server2.ts", content);
