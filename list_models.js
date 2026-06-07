import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    try {
        const response = await ai.models.list();
        const models = [];
        for await (const model of response) {
            models.push(model.name);
        }
        console.log("AVAILABLE MODELS:", models);
    } catch (e) {
        console.error(e);
    }
}
main();
