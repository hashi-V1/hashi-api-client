import { Progress } from "./types/progress";
/**
 * Creates a non optional progressCallback with the parameter or if it is undefined
 * a default progress callback which prints the progress message to the console.
 * @param progressCallback an optional progress callback to use if non null
 * @returns a non optional progress callback (by default prints to console)
 */
export declare function setProgressCallback(progressCallback?: (progress: Progress) => void): (progress: Progress) => Promise<void>;
/**
 * Transforms a text from ascii to hex.
 * @param input An Ascii string
 * @returns an hexadecimal representation of the input
 */
export declare function stringToHex(input: string): string;
