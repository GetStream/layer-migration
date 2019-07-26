const { Command, flags } = require('@oclif/command');

class LayerMigrateCommand extends Command {
	async run() {
		const { flags } = this.parse(LayerMigrateCommand);
		const name = flags.name || 'world';
		this.log(`hello ${name} from ./src/index.js`);
	}
}

LayerMigrateCommand.flags = {
	version: flags.version({ char: 'v' }),
	help: flags.help({ char: 'h' }),
	name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = LayerMigrateCommand;
