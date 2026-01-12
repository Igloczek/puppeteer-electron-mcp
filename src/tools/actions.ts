import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withPage } from "@/lib/puppeteer.ts";

import { type KeyInput } from "puppeteer-core";

export function registerActionTools(server: McpServer) {
  server.registerTool(
    "click_element",
    {
      description:
        "Click an element using a CSS selector. Simulates a real human mouse click.",
      inputSchema: {
        selector: z.string(),
      },
    },
    async ({ selector }) => {
      return await withPage(async (page) => {
        await page.waitForSelector(selector, { timeout: 3000 });
        await page.click(selector);
        return { content: [{ type: "text", text: `Clicked: ${selector}` }] };
      });
    }
  );

  server.registerTool(
    "type_text",
    {
      description: "Type text into an input field. Simulates real keystrokes.",
      inputSchema: {
        selector: z.string(),
        text: z.string(),
      },
    },
    async ({ selector, text }) => {
      return await withPage(async (page) => {
        await page.waitForSelector(selector, { timeout: 3000 });
        // Clear existing text first
        await page.click(selector, { clickCount: 3 });
        await page.keyboard.press("Backspace");

        await page.type(selector, text, { delay: 5 });
        return {
          content: [{ type: "text", text: `Typed "${text}" into ${selector}` }],
        };
      });
    }
  );

  server.registerTool(
    "press_key",
    {
      description:
        "Press a specific keyboard key (e.g., 'Enter', 'Tab', 'Escape', 'Backspace').",
      inputSchema: {
        key: z.string(),
      },
    },
    async ({ key }) => {
      return await withPage(async (page) => {
        await page.keyboard.press(key as KeyInput);
        return { content: [{ type: "text", text: `Pressed Key: ${key}` }] };
      });
    }
  );
}
