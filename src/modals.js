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
				placeholder: 'Edit your payload JSON...',
				value: `{
	"flags": 32768,
	"components": [
		{
			"type": 10,
			"content": "This is a message with v2 components"
		},
		{
			"type": 1,
			"components": [
				{
					"type": 2,
					"style": 1,
					"label": "Click Me",
					"custom_id": "click_me_1"
				},
				{
					"type": 2,
					"style": 2,
					"label": "Click Me Too",
					"custom_id": "click_me_2"
				}
			]
		}
	]
}`,
				required: true,
			},
		],
	},
});
