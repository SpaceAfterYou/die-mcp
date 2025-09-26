import type { Config } from '../config/index'
import { z } from 'zod'
import { executeDie } from '../die/index'
import { extractBasicInfo } from '../formatters/index'

export const getFileInfoSchema = {
  title: 'Get File Information',
  description: 'Get basic information about a file using DIE (file type, architecture, etc.)',
  inputSchema: {
    filePath: z.string().describe('Path to the file to analyze'),
    // DIE scan options
    recursiveScan: z.boolean().optional().describe('Enable recursive scan'),
    deepScan: z.boolean().optional().describe('Enable deep scan'),
    useHeuristics: z.boolean().optional().describe('Enable heuristic scan'),
    verbose: z.boolean().optional().describe('Enable verbose output'),
    aggressiveScan: z.boolean().optional().describe('Enable aggressive scan'),
    allTypes: z.boolean().optional().describe('Scan all types'),
    hideUnknown: z.boolean().optional().describe('Hide unknown detections'),
    showEntropy: z.boolean().optional().describe('Show entropy information'),
    showInfo: z.boolean().optional().describe('Show file information'),
    specialMethod: z.string().optional().describe('Special method to use (e.g., "Hash", "Hash#MD5")'),
    // Database options
    database: z.string().optional().describe('Path to custom database'),
    extraDatabase: z.string().optional().describe('Path to extra database'),
    customDatabase: z.string().optional().describe('Path to custom database'),
  },
}

export async function getFileInfo(
  params: {
    filePath: string
    recursiveScan?: boolean
    deepScan?: boolean
    useHeuristics?: boolean
    verbose?: boolean
    aggressiveScan?: boolean
    allTypes?: boolean
    hideUnknown?: boolean
    showEntropy?: boolean
    showInfo?: boolean
    specialMethod?: string
    database?: string
    extraDatabase?: string
    customDatabase?: string
  },
  config: Config,
) {
  try {
    const result = await executeDie(config.DIE_PATH, params.filePath, {
      timeout: config.TIMEOUT,
      debug: config.DEBUG,
      useHeuristics: params.useHeuristics ?? true, // Default to true to avoid warnings
      recursiveScan: params.recursiveScan,
      deepScan: params.deepScan,
      verbose: params.verbose,
      aggressiveScan: params.aggressiveScan,
      allTypes: params.allTypes,
      hideUnknown: params.hideUnknown,
      showEntropy: params.showEntropy,
      showInfo: params.showInfo,
      specialMethod: params.specialMethod,
      database: params.database,
      extraDatabase: params.extraDatabase,
      customDatabase: params.customDatabase,
      outputFormat: 'json', // Always use JSON internally
    })

    if (!result.success) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error getting file info: ${result.error}`,
        }],
        isError: true,
      }
    }

    try {
      const jsonResult = JSON.parse(result.output)
      const basicInfo = extractBasicInfo(jsonResult)

      return {
        content: [{ type: 'text' as const, text: basicInfo }],
      }
    }
    catch (parseError) {
      // If JSON parsing fails, return raw output with error info
      return {
        content: [{
          type: 'text' as const,
          text: `JSON Parse Error: ${parseError instanceof Error ? parseError.message : String(parseError)}\n\nRaw DIE Output:\n${result.output}`,
        }],
        isError: true,
      }
    }
  }
  catch (error) {
    return {
      content: [{
        type: 'text' as const,
        text: `Error getting file info: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
}
