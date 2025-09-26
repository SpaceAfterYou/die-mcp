/**
 * Format DIE JSON result as readable text
 */
export function formatDieResult(jsonResult: any): string {
  let output = '=== Detect It Easy Analysis Results ===\n\n'

  if (jsonResult.file) {
    output += `File: ${jsonResult.file}\n`
  }

  if (jsonResult.type) {
    output += `Type: ${jsonResult.type}\n`
  }

  if (jsonResult.arch) {
    output += `Architecture: ${jsonResult.arch}\n`
  }

  if (jsonResult.mode) {
    output += `Mode: ${jsonResult.mode}\n`
  }

  if (jsonResult.endianness) {
    output += `Endianness: ${jsonResult.endianness}\n`
  }

  if (jsonResult.entry) {
    output += `Entry Point: ${jsonResult.entry}\n`
  }

  if (jsonResult.ep) {
    output += `EP: ${jsonResult.ep}\n`
  }

  if (jsonResult.overlay) {
    output += `Overlay: ${jsonResult.overlay}\n`
  }

  if (jsonResult.signature) {
    output += `\nSignature:\n${jsonResult.signature}\n`
  }

  if (jsonResult.strings) {
    output += `\nStrings (${jsonResult.strings.length} found):\n`
    jsonResult.strings.slice(0, 10).forEach((str: any, index: number) => {
      output += `  ${index + 1}. ${str.value}\n`
    })
    if (jsonResult.strings.length > 10) {
      output += `  ... and ${jsonResult.strings.length - 10} more\n`
    }
  }

  if (jsonResult.detects && jsonResult.detects.length > 0) {
    output += `\nDetections:\n`
    jsonResult.detects.forEach((detect: any, index: number) => {
      output += `  ${index + 1}. ${detect.name} (${detect.version || 'Unknown version'})\n`
    })
  }

  return output
}

/**
 * Extract basic file information from DIE JSON result
 */
export function extractBasicInfo(jsonResult: any): string {
  let info = '=== Basic File Information ===\n\n'

  if (jsonResult.file) {
    info += `File: ${jsonResult.file}\n`
  }

  if (jsonResult.type) {
    info += `Type: ${jsonResult.type}\n`
  }

  if (jsonResult.arch) {
    info += `Architecture: ${jsonResult.arch}\n`
  }

  if (jsonResult.mode) {
    info += `Mode: ${jsonResult.mode}\n`
  }

  if (jsonResult.endianness) {
    info += `Endianness: ${jsonResult.endianness}\n`
  }

  if (jsonResult.entry) {
    info += `Entry Point: ${jsonResult.entry}\n`
  }

  if (jsonResult.overlay) {
    info += `Overlay: ${jsonResult.overlay}\n`
  }

  if (jsonResult.detects && jsonResult.detects.length > 0) {
    info += `\nDetected:\n`
    jsonResult.detects.forEach((detect: any) => {
      info += `  - ${detect.name}${detect.version ? ` (${detect.version})` : ''}\n`
    })
  }

  return info
}
