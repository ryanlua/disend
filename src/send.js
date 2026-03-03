/**
 * Handle the `/send` command.
 * @param {import('discord-api-types/v10').APIApplicationCommandInteraction} interaction
 * @param {{ DISCORD_BOT_TOKEN?: string, DISCORD_TOKEN?: string }} env
 * @returns {Promise<void>}
 */
export async function handleSendCommand(interaction, env) {
	const botToken = env.DISCORD_BOT_TOKEN?.trim() || env.DISCORD_TOKEN?.trim();
	if (!botToken) {
		console.error('Missing DISCORD_BOT_TOKEN or DISCORD_TOKEN');
		return;
	}

	const channelId = interaction.channel_id;
	if (!channelId) {
		console.error('Missing channel_id on interaction');
		return;
	}

	const response = await fetch(
		`https://discord.com/api/v10/channels/${channelId}/messages`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bot ${botToken}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				content: 'Hello world 👋',
				allowed_mentions: { parse: [] },
			}),
		},
	);

	if (!response.ok) {
		console.error(
			'Failed to post standalone message:',
			response.status,
			await response.text(),
		);
	}
}
