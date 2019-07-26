const { Command, flags } = require('@oclif/command');
const fs = require('fs');

const LayerChat = require('../../client');

class RegisterKeyCommand extends Command {
    async run() {
        const { flags } = this.parse(RegisterKeyCommand);

        const file = flags.file || 'keys/layer-export.pub';
        const contents = fs.readFileSync(file, 'utf8');

        const l = new LayerChat(
            process.env.LAYER_APP_ID,
            process.env.LAYER_TOKEN
        );
        const res = await l.registerPublicKey(contents);

        this.log(res);
    }
}

RegisterKeyCommand.flags = {
    file: flags.string({
        char: 'f',
        description: 'your .pub file',
    }),
};

module.exports = RegisterKeyCommand;
