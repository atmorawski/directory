import { runSync } from "./sync";

async function main(): Promise<void> {
  try {
    const result = await runSync();
    console.log("Sync completed", result);
  } catch (error) {
    console.error("Sync failed", error);
    process.exitCode = 1;
  }
}

void main();
