# Tech Stack: Puppeteer Electron MCP Server

## Architecture

The server acts as an MCP host that connects to a target Electron application via the Chrome DevTools Protocol (CDP).

## Core Technologies

- **Runtime**: [Bun](https://bun.sh) - Chosen for its high-performance JavaScript execution and built-in bundling capabilities.
- **Protocol**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - Used for standardizing communication between the AI agent and the server.
- **Automation Layer**: `puppeteer-core` - Leverages Puppeteer to attach to the Electron application's remote debugging port.
- **Validation**: `zod` - Ensures strict schema validation for all tool arguments.

## Internal Structure

- **Entry Point**: `src/index.ts` - Initializes the MCP server and registers all available tools.
- **Tool Modules**:
  - `src/tools/vision.ts`: Logic for capturing DOM snapshots and PNG screenshots.
  - `src/tools/actions.ts`: Implementation of user interactions (click, type, press).
- **Core Library**:
  - `src/lib/puppeteer.ts`: Manages the browser instance and connection state.
  - `src/lib/logger.ts`: Provides filtered logging to file or console.

## Tool Definitions

The server exposes the following MCP tools:

- `get_dom_snapshot`: Returns serialized HTML structure.
- `take_screenshot`: Captures a base64 encoded PNG.
- `click_element`: Simulates mouse events via CSS selectors.
- `type_text`: Simulates keyboard input into focused elements.
- `press_key`: Handles raw key mappings (e.g., 'Enter', 'Escape').

## Deployment & Distribution

- **Build System**: Custom script (`scripts/build.ts`) using Bun's API to bundle the project into a single `dist/index.js`.
- **NPM Interface**: Provided via the `bin` configuration in `package.json`, allowing execution via `npx`.
- **Formatting/Linting**: Biome is used for code quality and consistency.
