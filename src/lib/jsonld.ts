/**
 * Serialize an object for embedding inside a <script type="application/ld+json">
 * tag. Plain `JSON.stringify` does NOT escape `<`, `>` or `&`, so any value that
 * contains `</script>` (or `<!--`) would break out of the script element — a
 * classic JSON-in-HTML XSS sink (the strict nonce CSP would block the injected
 * script from running, but this closes the hole at the source too). Escaping the
 * three characters keeps the output valid JSON while making breakout impossible.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
