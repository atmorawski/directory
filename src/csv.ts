import { stringify } from "csv-stringify/sync";

import { PublicChannelRecord } from "./types";

export function buildChannelsCsv(channels: PublicChannelRecord[]): string {
  return stringify(
    channels.map((channel) => ({
      channel_id: channel.channelId,
      name: channel.name,
      description: channel.description,
      slack_connect: channel.isSlackConnect ? "yes" : "no",
    })),
    {
      header: true,
    },
  );
}
