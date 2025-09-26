import type { Config } from '../config/index'
import { z } from 'zod'
import { executeDie } from '../die/index'

export const showDatabaseSchema = {
  title: 'Show Database',
  description: 'Show information about the DIE database',
  inputSchema: {
    database: z.string().optional().describe('Path to custom database'),
    extraDatabase: z.string().optional().describe('Path to extra database'),
    customDatabase: z.string().optional().describe('Path to custom database'),
  },
}

export async function showDatabase(
  params: {
    database?: string
    extraDatabase?: string
    customDatabase?: string
  },
  config: Config,
) {
  try {
    const result = await executeDie(config.DIE_PATH, '', {
      timeout: config.TIMEOUT,
      debug: config.DEBUG,
      showDatabase: true,
      database: params.database,
      extraDatabase: params.extraDatabase,
      customDatabase: params.customDatabase,
      outputFormat: 'plaintext',
    })

    if (!result.success) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error showing database: ${result.error}`,
        }],
        isError: true,
      }
    }

    return {
      content: [{ type: 'text' as const, text: result.output }],
    }
  }
  catch (error) {
    return {
      content: [{
        type: 'text' as const,
        text: `Error showing database: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
}
