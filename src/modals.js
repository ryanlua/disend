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
				type: ComponentType.Label,
				label: 'Message payload (JSON)',
				description: 'Paste your message payload JSON here. You can also upload files to reference in the payload.',
				component: {
					type: ComponentType.TextInput,
					custom_id: 'payload_input',
					style: TextInputStyle.Paragraph,
					placeholder: 'Paste your payload JSON...',
					required: true,
				},
			},
			{
				type: ComponentType.Label,
				label: 'Upload files (optional)',
				description:
					'Use in payload with attachment://filename (e.g. embed image or components).',
				component: {
					type: ComponentType.FileUpload,
					custom_id: 'payload_files',
					required: false,
					min_values: 0,
					max_values: 10,
				},
			},
		],
	},
});
