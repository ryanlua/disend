import { InteractionResponseType } from 'discord-api-types/v10';

/**
 * Handle the `/send` command.
 * @param {import('discord-api-types/v10').APIApplicationCommandInteraction} interaction
 * @param {{ DISCORD_BOT_TOKEN?: string, DISCORD_TOKEN?: string }} env
 * @param {ExecutionContext} ctx
 * @returns {Response}
 */
export function handleSendCommand(interaction, env, ctx) {
	const botToken = env.DISCORD_BOT_TOKEN?.trim() || env.DISCORD_TOKEN?.trim();
	if (!botToken) {
		console.error('Missing DISCORD_BOT_TOKEN or DISCORD_TOKEN');
		return jsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: 'Bot token not configured (DISCORD_TOKEN).',
				flags: 64,
			},
		});
	}

	const channelId = interaction.channel_id;
	if (!channelId) {
		return jsonResponse(
			{ error: 'Missing channel_id on interaction' },
			{ status: 400 },
		);
	}

	ctx.waitUntil(
		fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
			method: 'POST',
			headers: {
				Authorization: `Bot ${botToken}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				content: 'Hello world 👋',
				allowed_mentions: { parse: [] },
			}),
		}).then(async (response) => {
			if (!response.ok) {
				console.error(
					'Failed to post standalone message:',
					response.status,
					await response.text(),
				);
			}
		}),
	);

	return jsonResponse({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: 'Sent ✅',
			flags: 64,
		},
	});
}

/**
 * @param {unknown} body
 * @param {ResponseInit} [init]
 * @returns {Response}
 */
function jsonResponse(body, init) {
	const responseInit = init || {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	};

	return new Response(JSON.stringify(body), responseInit);
}
