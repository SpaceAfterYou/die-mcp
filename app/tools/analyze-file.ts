import type { Config } from '../config/index'
import { z } from 'zod'
import { executeDie } from '../die/index'
import { formatDieResult } from '../formatters/index'

export const analyzeFileSchema = {
  title: 'Analyze File',
  description: 'Analyze an executable file using Detect It Easy to get detailed information about the program',
  inputSchema: {
    filePath: z.string().describe('Path to the executable file to analyze'),
    outputFormat: z.enum(['json', 'text']).default('json').describe('Output format for the analysis results'),
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

export async function analyzeFile(
  params: {
    filePath: string
    outputFormat: 'json' | 'text'
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
    if (config.DEBUG) {
      console.info(`Analyzing file: ${params.filePath}`)
    }

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
      outputFormat: 'json', // Always use JSON internally, format later if needed
    })

    if (!result.success) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error analyzing file: ${result.error}`,
        }],
        isError: true,
      }
    }

    if (params.outputFormat === 'text') {
      // Parse JSON and format as readable text
      try {
        const jsonResult = JSON.parse(result.output)
        const formattedText = formatDieResult(jsonResult)
        return {
          content: [{ type: 'text' as const, text: formattedText }],
        }
      }
      catch {
        // If JSON parsing fails, return raw output
        return {
          content: [{ type: 'text' as const, text: result.output }],
        }
      }
    }
    else {
      return {
        content: [{ type: 'text' as const, text: result.output }],
      }
    }
  }
  catch (error) {
    return {
      content: [{
        type: 'text' as const,
        text: `Error analyzing file: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
}
