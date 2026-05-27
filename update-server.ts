import fs from "fs";
let content = fs.readFileSync("server.ts", "utf8");
content = content.replace(/gemini-2\.5-flash/g, "gemini-3-flash-preview");
content = content.replace(/error: error\.message/g, "error: error.message, stack: error.stack");
fs.writeFileSync("server.ts", content);
