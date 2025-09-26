import type { Config } from '../config/index'
import { z } from 'zod'
import { executeDie } from '../die/index'

export const showMethodsSchema = {
  title: 'Show Methods',
  description: 'Show all special methods available for file analysis',
  inputSchema: {
    filePath: z.string().describe('Path to the file to analyze'),
  },
}

export async function showMethods(
  params: { filePath: string },
  config: Config,
) {
  try {
    const result = await executeDie(config.DIE_PATH, params.filePath, {
      timeout: config.TIMEOUT,
      debug: config.DEBUG,
      showMethods: true,
      outputFormat: 'plaintext',
    })

    if (!result.success) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error showing methods: ${result.error}`,
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
        text: `Error showing methods: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
}
