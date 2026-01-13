import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { log, logError } from "@/lib/logger";

const REMOTE_DEBUG_PORT = process.env.ELECTRON_PORT || "9222";

export async function getPage(): Promise<{ browser: Browser; page: Page }> {
  log(`Connecting to Electron on port ${REMOTE_DEBUG_PORT}...`);
  try {
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${REMOTE_DEBUG_PORT}`,
      defaultViewport: null,
    });
    const pages = await browser.pages();
    log(`Found ${pages.length} pages`);

    // Find a page that is not a DevTools page, or default to the first one
    const appPage =
      pages.find((p) => !p.url().startsWith("devtools://")) || pages[0];

    if (!appPage) {
      throw new Error("Connected to Electron, but no active window was found.");
    }

    log(`Using page: ${appPage.url()}`);
    return { browser, page: appPage };
  } catch (err) {
    logError(`Connection Error (port ${REMOTE_DEBUG_PORT})`, err);
    throw err;
  }
}

/**
 * Higher-order function to wrap tool execution with page connection/disconnection.
 * Ensures the browser is disconnected after each operation to prevent resource leaks.
 */
export async function withPage(
  callback: (page: Page) => Promise<CallToolResult>
): Promise<CallToolResult> {
  let browserInstance: Browser | null = null;
  try {
    const { browser, page } = await getPage();
    browserInstance = browser;
    log("Executing tool callback...");
    const result = await callback(page);
    log("Tool callback completed successfully");
    return result;
  } catch (error) {
    logError("Tool Execution Error", error);
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
    };
  } finally {
    if (browserInstance) {
      try {
        await browserInstance.disconnect();
        log("Browser disconnected");
      } catch (e) {
        logError("Cleanup Error", e);
      }
    }
  }
}
