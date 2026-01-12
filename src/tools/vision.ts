import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withPage } from "@/lib/puppeteer.ts";

export function registerVisionTools(server: McpServer) {
  server.registerTool(
    "get_dom_snapshot",
    {
      description:
        "Get the text structure (HTML) of the current screen. Fast and cheap.",
    },
    async () => {
      return await withPage(async (page) => {
        const content = await page.content();
        return { content: [{ type: "text", text: content }] };
      });
    }
  );

  server.registerTool(
    "take_screenshot",
    {
      description:
        "Take a visual screenshot of the current app state. Use this to verify UI bugs or styling.",
    },
    async () => {
      return await withPage(async (page) => {
        const base64Image = await page.screenshot({
          encoding: "base64",
          type: "png",
        });
        return {
          content: [
            {
              type: "image",
              data: base64Image,
              mimeType: "image/png",
            },
          ],
        };
      });
    }
  );
}
