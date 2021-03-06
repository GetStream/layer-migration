const { Command, flags } = require('@oclif/command');
const fs = require('fs');

const LayerChat = require('../client');

class Webhook extends Command {
	async run() {
		const { flags } = this.parse(Webhook);
		const url = flags.url;

		const l = LayerChat.LayerClientFromEnv();

		const res = await l.registerWebhook({
			version: '3.0',
			events: ['Message.created'],
			target_url: url,
			secret: flags.secret,
		});
		//const res = await l.webhooks();
		this.log(res);
	}
}

Webhook.flags = {
	url: flags.string({
		char: 'u',
		description: 'the webhook url',
	}),
	secret: flags.string({
		char: 's',
		description: 'the secret to use for the webook. you need to use the same secret when validating the webhook',
	}),
};

module.exports = Webhook;
