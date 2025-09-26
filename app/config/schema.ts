import { z } from 'zod'

// Configuration schema for the DIE MCP server
export const configSchema = z.object({
  DIE_PATH: z.string().describe('Path to the DIE executable'),
  DEBUG: z.boolean().describe('Enable debug logging'),
  TIMEOUT: z.number().describe('Timeout for DIE operations in milliseconds'),
})

export type Config = z.infer<typeof configSchema>

// Default configuration values
export const defaultConfig: Config = {
  DIE_PATH: '',
  DEBUG: false,
  TIMEOUT: 30000,
}
