import type { DieOptions, DieOutputFormat, DieResult } from './types'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

/**
 * Execute DIE with the specified file path and options
 */
export async function executeDie(
  diePath: string,
  filePath: string,
  options: DieOptions = {},
): Promise<DieResult> {
  return new Promise((resolve) => {
    if (!existsSync(diePath)) {
      resolve({
        success: false,
        output: '',
        error: `DIE executable not found at: ${diePath}`,
      })
      return
    }

    if (!existsSync(filePath)) {
      resolve({
        success: false,
        output: '',
        error: `Target file not found: ${filePath}`,
      })
      return
    }

    const args = buildDieArgs(filePath, options)

    if (options.debug) {
      console.warn(`Executing DIE: ${diePath} ${args.join(' ')}`)
    }

    const child = spawn(diePath, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: options.timeout || 30000,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        const cleanedOutput = cleanDieOutput(stdout, options.outputFormat)
        resolve({
          success: true,
          output: cleanedOutput,
          exitCode: code ?? undefined,
        })
      }
      else {
        resolve({
          success: false,
          output: stdout,
          error: stderr,
          exitCode: code ?? undefined,
        })
      }
    })

    child.on('error', (error) => {
      resolve({
        success: false,
        output: '',
        error: `Failed to execute DIE: ${error.message}`,
      })
    })
  })
}

/**
 * Build command line arguments for DIE based on options
 */
function buildDieArgs(filePath: string, options: DieOptions): string[] {
  const args: string[] = []

  // Output format flags (mutually exclusive)
  if (options.outputFormat) {
    switch (options.outputFormat) {
      case 'json':
        args.push('-j', '--json')
        break
      case 'xml':
        args.push('-x', '--xml')
        break
      case 'csv':
        args.push('-c', '--csv')
        break
      case 'tsv':
        args.push('-t', '--tsv')
        break
      case 'plaintext':
        args.push('-p', '--plaintext')
        break
    }
  }
  else {
    // Default to JSON if no format specified
    args.push('-j', '--json')
  }

  // Scan options
  if (options.recursiveScan) {
    args.push('-r', '--recursivescan')
  }
  if (options.deepScan) {
    args.push('-d', '--deepscan')
  }
  if (options.useHeuristics) {
    args.push('-u', '--heuristicscan')
  }
  if (options.aggressiveScan) {
    args.push('-g', '--aggressivecscan')
  }
  if (options.allTypes) {
    args.push('-a', '--alltypes')
  }

  // Display options
  if (options.verbose) {
    args.push('-b', '--verbose')
  }
  if (options.hideUnknown) {
    args.push('-U', '--hideunknown')
  }
  if (options.showEntropy) {
    args.push('-e', '--entropy')
  }
  if (options.showInfo) {
    args.push('-i', '--info')
  }

  // Special options
  if (options.format) {
    args.push('-f', '--format')
  }
  if (options.profiling) {
    args.push('-l', '--profiling')
  }
  if (options.specialMethod) {
    args.push('-S', '--special', options.specialMethod)
  }

  // Database options
  if (options.database) {
    args.push('-D', '--database', options.database)
  }
  if (options.extraDatabase) {
    args.push('-E', '--extradatabase', options.extraDatabase)
  }
  if (options.customDatabase) {
    args.push('-C', '--customdatabase', options.customDatabase)
  }
  if (options.showDatabase) {
    args.push('-s', '--showdatabase')
  }
  if (options.showMethods) {
    args.push('-m', '--showmethods')
  }

  // Target file path (always last)
  args.push(filePath)

  return args
}

/**
 * Clean DIE output by removing warning messages and extracting JSON
 */
function cleanDieOutput(output: string, outputFormat?: DieOutputFormat): string {
  const cleanedOutput = output.trim()

  // For JSON output, try to extract valid JSON
  if (!outputFormat || outputFormat === 'json') {
    const lines = cleanedOutput.split('\n')
    const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('{'))

    if (jsonStartIndex > 0) {
      // Remove warning lines before JSON
      const jsonLines = lines.slice(jsonStartIndex)
      return jsonLines.join('\n')
    }
    else {
      // If no JSON found, try to find JSON anywhere in the output
      const jsonMatch = cleanedOutput.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return jsonMatch[0]
      }
    }
  }

  return cleanedOutput
}
