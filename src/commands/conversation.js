const { Command, flags } = require('@oclif/command');

const LayerChat = require('../../client');

class ConversationCommand extends Command {
	async run() {
		const { flags } = this.parse(ConversationCommand);

		const l = new LayerChat(
			process.env.LAYER_APP_ID,
			process.env.LAYER_TOKEN
		);
		const res = await l.createConversation(flags.data);

		this.log(res);
	}
}

ConversationCommand.description = 'creates a new conversation in layer';

ConversationCommand.flags = {
	data: flags.string({
		char: 'd',
		description: 'the data for your conversation',
	}),
};

module.exports = ConversationCommand;
