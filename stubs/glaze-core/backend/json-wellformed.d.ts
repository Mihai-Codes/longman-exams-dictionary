/**
 * Repair of lone UTF-16 surrogate escapes in serialized JSON frames.
 *
 * JSON.stringify (well-formed mode) serializes a lone surrogate in a string as
 * a `\udXXX` escape. That output is spec-valid JSON and JS `JSON.parse`
 * accepts it, but Foundation's `JSONSerialization` on the Swift side rejects
 * the whole frame ("Unable to convert hex escape sequence"), which silently
 * wedges the stdio IPC channel: the response is never delivered and the
 * renderer waits until its request timeout (GLAZE-774).
 *
 * This operates on the serialized text rather than the value graph so a single
 * pass at the transport boundary covers every frame shape (responses,
 * notifications, structured-clone envelopes).
 */
/**
 * Replace lone surrogate escapes in JSON text with the `�` (U+FFFD)
 * escape, leaving valid escaped pairs and literal backslash content untouched.
 * Returns the input string unchanged when there is nothing to repair.
 */
export declare function sanitizeLoneSurrogateJsonEscapes(json: string): string;
