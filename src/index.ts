import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import packageJson from "../package.json";

import { registerVisionTools } from "@/tools/vision";
import { registerActionTools } from "@/tools/actions";
import { log, logError } from "@/lib/logger";

const server = new McpServer({
  name: "puppeteer-electron-mcp",
  description: packageJson.description,
  websiteUrl: packageJson.homepage,
  version: packageJson.version,
}, {
  capabilities: {
    resources: {},
    prompts: {},
  }
});

// Register tool modules
log("Registering vision tools...");
registerVisionTools(server);
log("Registering action tools...");
registerActionTools(server);
log("All tools registered.");

// Add empty handlers for resources/prompts since we advertised capabilities
// This prevents "Method not found" errors when clients (like Claude) probe these features
server.server.setRequestHandler(
  z.object({ method: z.literal("resources/list") }).passthrough(),
  async () => ({ resources: [] })
);
server.server.setRequestHandler(
  z.object({ method: z.literal("resources/templates/list") }).passthrough(),
  async () => ({ resourceTemplates: [] })
);
server.server.setRequestHandler(
  z.object({ method: z.literal("prompts/list") }).passthrough(),
  async () => ({ prompts: [] })
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  
  log("Connecting transport...");
  await server.connect(transport);
  const port = process.env.ELECTRON_PORT || "9222";
  log(`Puppeteer Electron MCP Server Active (Target Port: ${port})`);
}

main().catch((error) => {
  logError("Critical server error", error);
  process.exit(1);
});
