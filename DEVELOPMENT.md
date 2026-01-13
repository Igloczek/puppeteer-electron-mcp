# Development

Instructions for developers who want to contribute to or build the **Puppeteer Electron MCP Server**.

## Prerequisites

- [Bun](https://bun.sh) runtime installed.

## Setup

```bash
bun install
```

## Running in Development

To run the server in watch mode:

```bash
bun run dev
```

To enable logging during development:

```bash
MCP_LOG_PATH="./mcp.log" bun run dev
```

## Building the Project

To bundle the project into a single JavaScript file for distribution:

```bash
bun run build
```

The output will be generated in the `dist/index.js` file.

## Project Structure

- `src/index.ts`: Entry point and server initialization.
- `src/tools/`: Domain-specific tool modules (Vision, Actions).
- `src/lib/`: Internal libraries (Puppeteer connection management).
