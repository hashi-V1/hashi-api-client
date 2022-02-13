import { Progress, progressConstants } from "./types/progress";

/**
 * Creates a non optional progressCallback with the parameter or if it is undefined
 * a default progress callback which prints the progress message to the console.
 * @param progressCallback an optional progress callback to use if non null
 * @returns a non optional progress callback (by default prints to console)
 */
export function setProgressCallback(
    progressCallback?: (progress: Progress) => void
) {
    return typeof progressCallback === "undefined"
        ? async (progress: Progress) => console.log(progressConstants[progress])
        : async (progress: Progress) => progressCallback(progress);
}

/**
 * Transforms a text from ascii to hex.
 * @param input An Ascii string
 * @returns an hexadecimal representation of the input
 */
export function stringToHex(input: string): string {
    let ret = "";
    for (let i = 0; i < input.length; i++) {
        ret += input.charCodeAt(i).toString(16);
    }
    return ret;
}
