import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerVisionTools } from "@/tools/vision.ts";
import { registerActionTools } from "@/tools/actions.ts";

/**
 * Electron Bridge MCP Server
 * Controls Electron applications via Puppeteer remote debugging
 */
const server = new McpServer({
  name: "puppeteer-electron-mcp",
  version: "1.0.0",
});

// Register tool modules
registerVisionTools(server);
registerActionTools(server);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const port = process.env.ELECTRON_PORT || "9222";
  console.error(`Puppeteer Electron MCP Server Active (Target Port: ${port})`);
}

main().catch((error) => {
  console.error("Critical server error:", error);
  process.exit(1);
});
