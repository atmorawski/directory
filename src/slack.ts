import { WebClient } from "@slack/web-api";

import { env } from "./config";
import { PublicChannelRecord } from "./types";

const slackClient = new WebClient(env.SLACK_BOT_TOKEN);

export async function fetchPublicChannels(): Promise<PublicChannelRecord[]> {
  const channels: PublicChannelRecord[] = [];
  let cursor: string | undefined;

  do {
    const response = await slackClient.conversations.list({
      types: "public_channel",
      exclude_archived: true,
      limit: 200,
      cursor,
    });

    for (const channel of response.channels ?? []) {
      if (!channel?.id || !channel.name || channel.is_archived) {
        continue;
      }

      channels.push({
        channelId: channel.id,
        name: channel.name,
        description: channel.purpose?.value?.trim() ?? "",
        isSlackConnect: Boolean(channel.is_ext_shared),
      });
    }

    cursor = response.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return channels.sort((left, right) => left.name.localeCompare(right.name));
}
