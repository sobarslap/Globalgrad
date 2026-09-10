import { UTApi } from "uploadthing/server";

async function main() {
  if (!process.env.UPLOADTHING_TOKEN) {
    console.log("UPLOADTHING_TOKEN not set");
    return;
  }
  const api = new UTApi();
  const res = await api.listFiles({ limit: 1 });
  console.log(JSON.stringify({ connected: true, fileCount: res.files.length }));
}
main().catch((e) => {
  console.error("UPLOADTHING CHECK FAILED:", e?.message ?? e);
  process.exit(1);
});
