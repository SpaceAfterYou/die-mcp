import type { Config } from '../config/index'
import { existsSync } from 'node:fs'

export const checkDieAvailabilitySchema = {
  title: 'Check DIE Availability',
  description: 'Check if the DIE executable is available and accessible',
  inputSchema: {},
}

export async function checkDieAvailability(config: Config) {
  try {
    const isAvailable = existsSync(config.DIE_PATH)
    const status = isAvailable ? 'Available' : 'Not found'
    const message = isAvailable
      ? `DIE executable is available at: ${config.DIE_PATH}`
      : `DIE executable not found at: ${config.DIE_PATH}. Please check the path in configuration.`

    return {
      content: [{ type: 'text' as const, text: `${status}\n${message}` }],
    }
  }
  catch (error) {
    return {
      content: [{
        type: 'text' as const,
        text: `Error checking DIE availability: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
}
