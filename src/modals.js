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
				type: ComponentType.TextInput,
				custom_id: 'payload_input',
				style: TextInputStyle.Paragraph,
				min_length: 100,
				max_length: 4000,
				placeholder: 'Paste your payload here...',
				required: true,
			},
		],
	},
});
