/**
 * Detect It Easy (DIE) MCP Server
 *
 * This MCP server provides access to Detect It Easy (DIE) functionality
 * for analyzing executable files and obtaining detailed information about programs.
 *
 * Repository: https://github.com/horsicq/Detect-It-Easy/
 */

import { loadConfig } from './config/index'
import { createServer } from './server/index'

// Load configuration from environment variables
const config = loadConfig()

// Create and start the server
createServer({ config })
