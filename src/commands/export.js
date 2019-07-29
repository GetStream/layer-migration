const { Command } = require('@oclif/command');

const LayerChat = require('../client');

class ExportCommand extends Command {
	async run() {
		const l = LayerChat.LayerClientFromEnv();

		const res = await l.createExport();
		this.log(res);
	}
}

ExportCommand.description =
	'starts a layer export – note that you need to register a key before this works';

module.exports = ExportCommand;
