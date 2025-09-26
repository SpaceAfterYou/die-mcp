import type { Config } from '../config/index'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  analyzeFile,
  analyzeFileSchema,
  checkDieAvailability,
  checkDieAvailabilitySchema,
  getFileInfo,
  getFileInfoSchema,
  showDatabase,
  showDatabaseSchema,
  showMethods,
  showMethodsSchema,
} from '../tools/index'

/**
 * Initialize the MCP server
 */
export function init(server: McpServer) {
  const transport = new StdioServerTransport()
  server.connect(transport).then(() => {
    console.warn('MCP Server is running...')
  }).catch((err) => {
    console.error('Failed to start the server:', err)
  })
}

/**
 * Create and configure the MCP server
 */
export function createServer({ config }: { config: Config }) {
  const server = new McpServer({
    name: 'Detect It Easy',
    version: '1.0.0',
  })

  // Tool: Analyze a file with DIE
  server.registerTool(
    'analyze_file',
    analyzeFileSchema,
    async params => analyzeFile(params, config),
  )

  // Tool: Get basic file information
  server.registerTool(
    'get_file_info',
    getFileInfoSchema,
    async params => getFileInfo(params, config),
  )

  // Tool: Check if DIE is available
  server.registerTool(
    'check_die_availability',
    checkDieAvailabilitySchema,
    async () => checkDieAvailability(config),
  )

  // Tool: Show database information
  server.registerTool(
    'show_database',
    showDatabaseSchema,
    async params => showDatabase(params, config),
  )

  // Tool: Show available methods
  server.registerTool(
    'show_methods',
    showMethodsSchema,
    async params => showMethods(params, config),
  )

  // Resource: DIE documentation
  server.registerResource(
    'die-documentation',
    'docs://die',
    {
      title: 'Detect It Easy Documentation',
      description: 'Documentation and information about Detect It Easy tool',
    },
    async uri => ({
      contents: [
        {
          uri: uri.href,
          text: `Detect It Easy (DIE) is a program for determining types of files.

Repository: https://github.com/horsicq/Detect-It-Easy/
Current executable path: ${config.DIE_PATH}

DIE can detect:
- File types and formats
- Compilers and packers used
- Architecture (x86, x64, ARM, etc.)
- Operating system targets
- Entry points and sections
- And much more...

This MCP server provides access to DIE functionality through tools:
- analyze_file: Full analysis of executable files with all DIE options
- get_file_info: Basic file information
- check_die_availability: Verify DIE is accessible
- show_database: Show database information
- show_methods: Show available special methods

Supported DIE flags:
- -r, --recursivescan: Recursive scan
- -d, --deepscan: Deep scan
- -u, --heuristicscan: Heuristic scan
- -b, --verbose: Verbose output
- -g, --aggressivecscan: Aggressive scan
- -a, --alltypes: Scan all types
- -f, --format: Format result
- -l, --profiling: Profiling signatures
- -U, --hideunknown: Hide unknown
- -e, --entropy: Show entropy
- -i, --info: Show file info
- -S, --special <method>: Special file info for <method>
- -x, --xml: Result as XML
- -j, --json: Result as JSON
- -c, --csv: Result as CSV
- -t, --tsv: Result as TSV
- -p, --plaintext: Result as Plain Text
- -D, --database <path>: Set database<path>
- -E, --extradatabase <path>: Set extra database<path>
- -C, --customdatabase <path>: Set custom database<path>
- -s, --showdatabase: Show database
- -m, --showmethods: Show all special methods for the file`,
          mimeType: 'text/plain',
        },
      ],
    }),
  )

  // Start the server
  init(server)
}
