import { describe, it, expect } from "vitest";
import {
  totp,
  verifyTotp,
  base32Encode,
  base32Decode,
  generateSecret,
  otpauthUri,
} from "../totp";

// RFC 6238 test vector secret: ASCII "12345678901234567890" as base32.
const RFC_SECRET = base32Encode(Buffer.from("12345678901234567890"));

describe("base32", () => {
  it("round-trips bytes", () => {
    const buf = Buffer.from("hello world");
    expect(base32Decode(base32Encode(buf)).toString()).toBe("hello world");
  });
});

describe("TOTP (RFC 6238 vectors, SHA-1, 6 digits)", () => {
  const cases: [number, string][] = [
    [59, "287082"],
    [1111111109, "081804"],
    [1111111111, "050471"],
    [1234567890, "005924"],
    [2000000000, "279037"],
  ];
  for (const [seconds, expected] of cases) {
    it(`t=${seconds} → ${expected}`, () => {
      expect(totp(RFC_SECRET, seconds * 1000)).toBe(expected);
    });
  }
});

describe("verifyTotp", () => {
  it("accepts the current code", () => {
    const now = Date.now();
    expect(verifyTotp(RFC_SECRET, totp(RFC_SECRET, now), now)).toBe(true);
  });

  it("rejects a wrong code", () => {
    expect(verifyTotp(RFC_SECRET, "000000", 59 * 1000)).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(verifyTotp(RFC_SECRET, "abc")).toBe(false);
    expect(verifyTotp(RFC_SECRET, "12345")).toBe(false);
  });

  it("tolerates ±1 step of drift", () => {
    const now = 1111111109 * 1000;
    const prev = totp(RFC_SECRET, now - 30 * 1000);
    expect(verifyTotp(RFC_SECRET, prev, now)).toBe(true);
  });
});

describe("secret + uri", () => {
  it("generates a decodable base32 secret", () => {
    const s = generateSecret();
    expect(base32Decode(s).length).toBe(20);
  });

  it("builds an otpauth uri with issuer + secret", () => {
    const uri = otpauthUri("ABCDEF", "a@b.com");
    expect(uri).toContain("otpauth://totp/");
    expect(uri).toContain("secret=ABCDEF");
    expect(uri).toContain("issuer=GlobalGrad");
  });
});
