import {
	ComponentType,
	InteractionResponseType,
	TextInputStyle,
} from 'discord-api-types/v10';

/**
 * Modal for getting the message payload.
 * @returns {import('discord-api-types/v10').APIModalInteractionResponse}
 */
export const PAYLOAD_MODAL = () => ({
	type: InteractionResponseType.Modal,
	data: {
		custom_id: 'message_payload_modal',
		title: 'Send Payload',
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.TextInput,
						custom_id: 'payload_input',
						label: 'Message payload (JSON)',
						style: TextInputStyle.Paragraph,
						placeholder: 'Paste your payload JSON...',
						required: true,
					},
				],
			},
		],
	},
});
