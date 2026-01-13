import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const LOG_FILE = process.env.MCP_LOG_PATH;

export function log(...args: unknown[]): void {
  if (!LOG_FILE) return;

  const timestamp = new Date().toISOString();
  const message = args
    .map((arg) => {
      if (typeof arg === "object" && arg !== null) {
        // Stringify with a replacer that truncates long strings (likely base64 images)
        return JSON.stringify(arg, (key, value) => {
          if (typeof value === "string" && value.length > 1000 && (value.startsWith("data:image/") || /^[a-zA-Z0-9+/=]+$/.test(value.substring(0, 100)))) {
            return `[IMAGE DATA (${value.length} chars)]`;
          }
          return value;
        }, 2);
      }
      return String(arg);
    })
    .join(" ");

  const logLine = `[${timestamp}] ${message}\n`;

  try {
    const logDir = dirname(LOG_FILE);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    appendFileSync(LOG_FILE, logLine);
  } catch (e) {
    // Ignore logging errors to not crash the MCP server
  }
}

export function logError(context: string, error: unknown): void {
  if (!LOG_FILE) return;
  
  const message = error instanceof Error ? error.stack || error.message : String(error);
  log(`[ERROR] ${context}:`, message);
}

if (LOG_FILE) {
  log("--- MCP Server Starting ---");
}
