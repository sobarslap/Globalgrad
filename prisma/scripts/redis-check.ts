import { Redis } from "@upstash/redis";

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.log("UPSTASH env not set locally:", { url: !!url, token: !!token });
    return;
  }
  const r = new Redis({ url, token });
  const k = `rl:selftest:${Date.now()}`;
  const a = await r.incr(k);
  await r.pexpire(k, 5000);
  const b = await r.incr(k);
  const ttl = await r.pttl(k);
  console.log(JSON.stringify({ connected: true, firstIncr: a, secondIncr: b, ttlMs: ttl }));
}
main().catch((e) => {
  console.error("REDIS CHECK FAILED:", e?.message ?? e);
  process.exit(1);
});
