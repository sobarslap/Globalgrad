import { hash, verify } from "@node-rs/argon2";

/**
 * Argon2id password hashing (Security check 2.4). Parameters follow OWASP
 * guidance. Never log or return the plaintext or the hash to clients.
 */
const opts = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, opts);
}

export function verifyPassword(
  hashed: string,
  plain: string
): Promise<boolean> {
  return verify(hashed, plain, opts);
}
