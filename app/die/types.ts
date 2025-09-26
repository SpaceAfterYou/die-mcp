/**
 * DIE execution options and types
 */

export interface DieOptions {
  timeout?: number
  debug?: boolean
  useHeuristics?: boolean
  recursiveScan?: boolean
  deepScan?: boolean
  verbose?: boolean
  aggressiveScan?: boolean
  allTypes?: boolean
  format?: boolean
  profiling?: boolean
  hideUnknown?: boolean
  showEntropy?: boolean
  showInfo?: boolean
  specialMethod?: string
  outputFormat?: 'json' | 'xml' | 'csv' | 'tsv' | 'plaintext'
  database?: string
  extraDatabase?: string
  customDatabase?: string
  showDatabase?: boolean
  showMethods?: boolean
}

export interface DieResult {
  success: boolean
  output: string
  error?: string
  exitCode?: number
}

export type DieOutputFormat = 'json' | 'xml' | 'csv' | 'tsv' | 'plaintext'
