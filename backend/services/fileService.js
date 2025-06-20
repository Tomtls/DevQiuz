import { readFile, writeFile } from 'fs/promises';

/**
 * Reads a JSON file from the given path and returns its contents as an object or array.
 * If the file does not exist or the content is invalid, an empty array is returned.
 *
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<any[]>} Parsed JSON content or an empty array in case of error
 */
export async function readJson(filePath) {
  try {
    // Attempt to read the file as UTF-8 text
    const data = await readFile(filePath, 'utf-8');

    // Try to parse the JSON content
    return JSON.parse(data);

  } catch (err) {
    // If the file does not exist, return an empty array instead of throwing
    if (err.code === 'ENOENT') {
      console.log(`[fileService: readJson] file does not exist ${filePath}:`)
      return [];
    } 
    
    // If JSON is malformed, log the error and return an empty array
    if (err instanceof SyntaxError) {
      console.error(`[fileService: readJson] JSON parse error in ${filePath}:`, err);
      return [];
    }

    // For any other errors, log and return an empty array
    console.error(`[fileService: readJson] Error reading ${filePath}:`, err);
    return [];
  }
}

/**
 * Writes an object or array to a JSON file at the given path.
 * The output is formatted with 2-space indentation for readability.
 *
 * @param {string} filePath - Path to the output JSON file
 * @param {any[]} data - Data to be stringified and written to the file
 * @returns {Promise<void>}
 */
export async function writeJson(filePath, data) {
  try {
    // Convert the data to a pretty-printed JSON string and write to file
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[fileService: writeJson] Error writing to ${filePath}:`, err);
  }
}