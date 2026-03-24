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
  const channels = await fetchPublicChannels();
  const csv = buildChannelsCsv(channels);
  const email = await sendCsvEmail(csv, channels.length);

  return {
    channelCount: channels.length,
    generatedAt: new Date().toISOString(),
    email,
  };
}
