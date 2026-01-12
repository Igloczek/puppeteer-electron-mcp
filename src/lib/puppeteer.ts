import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const REMOTE_DEBUG_PORT = process.env.ELECTRON_PORT || "9222";

export async function getPage(): Promise<{ browser: Browser; page: Page }> {
  try {
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${REMOTE_DEBUG_PORT}`,
      defaultViewport: null,
    });
    const pages = await browser.pages();

    // Find a page that is not a DevTools page, or default to the first one
    const appPage =
      pages.find((p) => !p.url().startsWith("devtools://")) || pages[0];

    if (!appPage) {
      throw new Error("Connected to Electron, but no active window was found.");
    }

    return { browser, page: appPage };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[Connection Error] Could not connect to Electron on port ${REMOTE_DEBUG_PORT}: ${message}`
    );
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
    return await callback(page);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Tool Execution Error] ${message}`);
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${message}` }],
    };
  } finally {
    if (browserInstance) {
      try {
        await browserInstance.disconnect();
      } catch (e) {
        console.error(`[Cleanup Error] Failed to disconnect browser: ${e}`);
      }
    }
  }
}
