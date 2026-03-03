/**
 * Share command metadata from a common spot to be used for both runtime and registration.
 */

import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
} from 'discord-api-types/v10';

/**
 * Clip command to create a clip from a message.
 * @type {import('discord-api-types/v10').RESTPostAPIApplicationCommandsJSONBody}
 */
export const SEND_COMMAND = {
	name: 'send',
	description: 'Send a message payload to the channel',
	integration_types: [
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall,
	],
	contexts: [
		InteractionContextType.PrivateChannel,
		InteractionContextType.Guild,
	],
	type: ApplicationCommandType.ChatInput,
};
