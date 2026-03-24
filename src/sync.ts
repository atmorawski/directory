import { buildChannelsCsv } from "./csv";
import { sendCsvEmail } from "./mailer";
import { fetchPublicChannels } from "./slack";

export type SyncResult = {
  channelCount: number;
  generatedAt: string;
  email: {
    accepted: string[];
    rejected: string[];
    messageId: string;
    response: string;
  };
};

export async function runSync(): Promise<SyncResult> {
  console.log("Fetching Slack channels");
  const channels = await fetchPublicChannels();
  console.log("Fetched Slack channels", { channelCount: channels.length });

  const csv = buildChannelsCsv(channels);
  console.log("Built CSV export");

  const email = await sendCsvEmail(csv, channels.length);
  console.log("Email send finished", email);

  return {
    channelCount: channels.length,
    generatedAt: new Date().toISOString(),
    email,
  };
}
