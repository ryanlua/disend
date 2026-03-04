import { MessageFlags } from 'discord-api-types/v10';
import { ERROR_COMPONENT } from './components.js';

/**
 * @typedef {Object} Env
 * @property {string} DISCORD_TOKEN
 * @property {string} DISCORD_APPLICATION_ID
 */

/**
 * Sends the message payload to the channel where the interaction occurred.
 * @param {import('discord-api-types/v10').APIInteraction} interaction - The Discord interaction object.
 * @param {Env} env - The environment variables.
 */
async function sendMessagePayload(interaction, env) {
	const token = env.DISCORD_TOKEN;
	const channelId = interaction.channel.id;
	if (!channelId) {
		throw new Error('Unable to determine channel id from interaction.');
	}
	const discordUrl = `https://discord.com/api/v10/channels/${channelId}/messages`;

	const response = await fetch(discordUrl, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bot ${token}`,
		},
		method: 'POST',
		body: JSON.stringify({
			content: 'Hello world 👋',
		}),
	});

	if (!response.ok) {
		const responseText = await response.text();
		throw new Error(
			`Failed to send message: ${response.status} ${responseText}`,
		);
	}
}

/**
 * Send a followup message using the interaction token.
 * @param {import('discord-api-types/v10').APIInteraction} interaction - The Discord interaction object.
 * @param {Env} env - The environment variables.
 * @param {import('discord-api-types/v10').APIInteractionResponseCallbackData} payload - The followup payload.
 * @returns {Promise<void>}
 */
async function sendFollowup(interaction, env, payload) {
	const discordUrl = `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}`;
	const discordResponse = await fetch(discordUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!discordResponse.ok) {
		const errorText = await discordResponse.text();
		throw new Error(
			`Failed to send followup to discord: ${discordResponse.status} ${errorText}`,
		);
	}
}

/**
 * Send the message payload and handle any errors.
 * @param {import('discord-api-types/v10').APIInteraction} interaction - The Discord interaction object.
 * @param {Env} env - The environment variables.
 */
export async function handleSendCommand(interaction, env) {
	try {
		await sendMessagePayload(interaction, env);
		await sendFollowup(interaction, env, {
			content: 'Successfully sent message payload to channel.',
			flags: MessageFlags.Ephemeral,
		});
	} catch (error) {
		console.error('Error sending message payload:', error);
		const errorStack = error instanceof Error ? error.stack : undefined;
		await sendFollowup(
			interaction,
			env,
			ERROR_COMPONENT(errorStack || 'Unknown error occurred'),
		);
	}
}
