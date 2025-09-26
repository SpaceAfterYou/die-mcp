import type { Config } from './schema'
import process from 'node:process'
import { configSchema, defaultConfig } from './schema'

/**
 * Load configuration from environment variables
 */
export function loadConfig(): Config {
  const envConfig = {
    DIE_PATH: process.env.DIE_PATH || defaultConfig.DIE_PATH,
    DEBUG: process.env.DEBUG === 'true' || defaultConfig.DEBUG,
    TIMEOUT: process.env.TIMEOUT ? Number.parseInt(process.env.TIMEOUT, 10) : defaultConfig.TIMEOUT,
  }

  // Validate configuration
  const result = configSchema.safeParse(envConfig)

  if (!result.success) {
    console.error('Configuration validation failed:', result.error.issues)
    throw new Error('Invalid configuration')
  }

  return result.data
}

export { type Config, configSchema } from './schema'
