/**
 * Sends a message payloads that are specified by the user in a modal.
 * This file was made using AI and hasn't been fully tested.
 * @todo: Clean up and improve error handling.
 */

import { MessageFlags } from 'discord-api-types/v10';
import { ERROR_COMPONENT } from './components.js';
import { PAYLOAD_MODAL } from './modals.js';

/**
 * @typedef {Object} Env
 * @property {string} DISCORD_TOKEN
 * @property {string} DISCORD_APPLICATION_ID
 */

/**
 * Sends the message payload to the channel where the interaction occurred.
 * @param {import('discord-api-types/v10').APIInteraction} interaction - The Discord interaction object.
 * @param {import('discord-api-types/v10').RESTPostAPIChannelMessageJSONBody} payload - The message payload.
 * @param {Env} env - The environment variables.
 */
async function sendMessagePayload(interaction, payload, env) {
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
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const responseText = await response.text();
		throw new Error(
			`Failed to send message: ${response.status} ${responseText}`,
		);
	}
}

/**
 * Returns the /send modal response.
 * @returns {import('discord-api-types/v10').APIModalInteractionResponse}
 */
export function handleSendCommand() {
	return PAYLOAD_MODAL;
}

/**
 * Extracts payload text from a modal submit interaction.
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction - The modal submit interaction.
 * @returns {string}
 */
function extractModalPayloadText(interaction) {
	for (const row of interaction.data.components) {
		for (const component of row.components) {
			if (component.custom_id === 'payload_input') {
				return component.value;
			}
		}
	}

	throw new Error('Payload input not found in modal submission.');
}

/**
 * Handles a payload modal submit interaction by sending the submitted payload.
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction - The modal submit interaction.
 * @param {Env} env - The environment variables.
 */
export async function handleSendModalSubmit(interaction, env) {
	try {
		const payloadText = extractModalPayloadText(interaction);
		/** @type {import('discord-api-types/v10').RESTPostAPIChannelMessageJSONBody} */
		const parsedPayload = JSON.parse(payloadText);

		await sendMessagePayload(interaction, parsedPayload, env);
		await sendFollowup(interaction, env, {
			content: 'Successfully sent message payload to channel.',
			flags: MessageFlags.Ephemeral,
		});
	} catch (error) {
		console.error('Error sending message payload from modal:', error);
		const errorStack = error instanceof Error ? error.stack : undefined;
		await sendFollowup(
			interaction,
			env,
			ERROR_COMPONENT(errorStack || 'Unknown error occurred'),
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
