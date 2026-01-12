# Puppeteer Electron MCP Server

A Model Context Protocol (MCP) server that provides a bridge to control and inspect Electron applications via Puppeteer.

## Features

- **Visual Inspections**: Capture screenshots and DOM snapshots of any running Electron app.
- **Remote Control**: Simulate human interactions like clicking, typing, and key presses.
- **Auto-Cleanup**: Automatically manages Puppeteer connections to prevent memory leaks.

## Prerequisites

The target Electron application must be running with remote debugging enabled. There are two ways to do this:

### Command Line Flag
Start your application with the following flag:
```bash
--remote-debugging-port=9222
```

### In your Electron Code
Add this to your main process file (usually `main.js` or `index.ts`) before the `app.on('ready', ...)` or `await app.whenReady()`:
```javascript
import { app } from 'electron';
app.commandLine.appendSwitch("remote-debugging-port", "9222");
```

## Usage

### Configuration for Claude Desktop

To use this server with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
"puppeteer-electron-mcp": {
  "command": "npx",
  "args": ["-y", "puppeteer-electron-mcp"]
}
```

#### Custom Connection Port (Optional)
By default, the server connects to port `9222`. If your application uses a different port, you can specify it via an environment variable:

```json
"puppeteer-electron-mcp": {
  "command": "npx",
  "args": ["-y", "puppeteer-electron-mcp"],
  "env": {
    "ELECTRON_PORT": "1234"
  }
}
```

## Available Tools
Once connected, the following tools become available to the AI:
```

| Tool               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `get_dom_snapshot` | Get the HTML structure of the current screen.  |
| `take_screenshot`  | Take a visual PNG screenshot.                  |
| `click_element`    | Click an element using a CSS selector.         |
| `type_text`        | Type text into an input field.                 |
| `press_key`        | Press a specific keyboard key (e.g., 'Enter'). |
```

For building from source or contributing, see [DEVELOPMENT.md](./DEVELOPMENT.md).
