/**
 * Sends a message payloads that are specified by the user in a modal.
 * This file was made using AI and hasn't been fully tested.
 * @todo: Clean up and improve error handling.
 */

import { ComponentType, MessageFlags } from 'discord-api-types/v10';
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
	return PAYLOAD_MODAL();
}

/**
 * Extracts payload text from a modal submit interaction.
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction - The modal submit interaction.
 * @returns {string}
 */
function findComponentByCustomId(interaction, customId) {
	const stack = [...interaction.data.components];

	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) {
			continue;
		}

		if ('custom_id' in current && current.custom_id === customId) {
			return current;
		}

		if ('component' in current && current.component) {
			stack.push(current.component);
		}

		if ('components' in current && Array.isArray(current.components)) {
			for (const nestedComponent of current.components) {
				stack.push(nestedComponent);
			}
		}
	}

	return null;
}

/**
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction
 * @returns {string}
 */
function extractModalPayloadText(interaction) {
	const payloadComponent = findComponentByCustomId(
		interaction,
		'payload_input',
	);
	if (payloadComponent && 'value' in payloadComponent) {
		return payloadComponent.value;
	}

	throw new Error('Payload input not found in modal submission.');
}

/**
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction
 * @returns {string[]}
 */
function extractUploadedAttachmentIds(interaction) {
	const fileUploadComponent = findComponentByCustomId(
		interaction,
		'payload_files',
	);
	if (!fileUploadComponent) {
		return [];
	}

	if (
		!('type' in fileUploadComponent) ||
		fileUploadComponent.type !== ComponentType.FileUpload
	) {
		return [];
	}

	if (
		'values' in fileUploadComponent &&
		Array.isArray(fileUploadComponent.values)
	) {
		return fileUploadComponent.values;
	}

	return [];
}

/**
 * @param {import('discord-api-types/v10').RESTPostAPIChannelMessageJSONBody} payload
 * @param {import('discord-api-types/v10').APIModalSubmitInteraction} interaction
 * @returns {import('discord-api-types/v10').RESTPostAPIChannelMessageJSONBody}
 */
function withUploadedAttachments(payload, interaction) {
	const uploadedAttachmentIds = extractUploadedAttachmentIds(interaction);
	if (uploadedAttachmentIds.length === 0) {
		return payload;
	}

	const resolvedAttachments = interaction.data.resolved?.attachments;
	if (!resolvedAttachments) {
		throw new Error(
			'Uploaded files were not present in resolved attachment data from Discord.',
		);
	}

	const attachmentsById = new Map(Object.entries(resolvedAttachments));
	const existingAttachments = Array.isArray(payload.attachments)
		? payload.attachments
		: [];

	const attachmentExists = new Set(
		existingAttachments.map((item) => String(item.id)),
	);
	const mergedAttachments = [...existingAttachments];

	for (const attachmentId of uploadedAttachmentIds) {
		if (attachmentExists.has(String(attachmentId))) {
			continue;
		}

		const attachment = attachmentsById.get(String(attachmentId));
		if (!attachment) {
			throw new Error(
				`Uploaded file ${attachmentId} was not found in resolved attachment data.`,
			);
		}

		mergedAttachments.push({
			id: attachment.id,
			filename: attachment.filename,
			description: attachment.description,
		});
	}

	return {
		...payload,
		attachments: mergedAttachments,
	};
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
		const payloadWithUploads = withUploadedAttachments(
			parsedPayload,
			interaction,
		);

		await sendMessagePayload(interaction, payloadWithUploads, env);
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
