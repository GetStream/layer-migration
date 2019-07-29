const { Command, flags } = require('@oclif/command');

const LayerChat = require('../client');

class TestWebhookCommand extends Command {
	async run() {
		const { flags } = this.parse(TestWebhookCommand);

		const l = LayerChat.LayerClientFromEnv();
		const messageText = flags.message || 'hello world';

		try {
			const user1 = await l.createIdentity({
				user_id: 'jack',
				display_name: 'Jack Jack',
			});
		} catch(e) {
			console.log(e);
		}

		try {
			const user2 = await l.createIdentity({
				user_id: 'nick',
				display_name: 'Nick',
			});
		} catch(e) {
			console.log(e);
		}

		const conversation = await l.createConversation({
			participants: ['nick', 'jack'],
		});
		this.log(
			`created a conversation for testing with id ${conversation.id}`
		);
		console.log(conversation);
		const conversationUUID = conversation.id.split('/')[
			conversation.id.split('/').length - 1
		];
		const res = await l.sendMessage(conversationUUID, {
			sender_id: 'layer:///identities/nick',
			parts: [{ body: messageText, mime_type: 'text/plain' }],
		});

		this.log(`created a message with response`, res);
	}
}

TestWebhookCommand.description =
	'creates a new message in layer so we can test the webhook';

TestWebhookCommand.flags = {
	message: flags.string({
		char: 'm',
		description: 'the message text...',
	}),
};

module.exports = TestWebhookCommand;
