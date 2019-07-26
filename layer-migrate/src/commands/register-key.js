const {Command, flags} = require('@oclif/command')
var fs = require('fs');
const LayerChat = require('../layer/client')

class RegisterKeyCommand extends Command {
  async run() {
    const {flags} = this.parse(RegisterKeyCommand)
    const file = flags.file || 'keys/layer-export.pub'
    var contents = fs.readFileSync(file, 'utf8');

    this.log('key is', contents);
    const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)

    const response = await l.registerPublicKey(contents)
    this.log('response is', response);
  }
}


RegisterKeyCommand.description = `Register your key for the Layer export
...
Specify the file path using -f, defaults to keys/layer-export.pub
`


RegisterKeyCommand.flags = {
  file: flags.string({char: 'f', description: 'the file path to your key'}),
}

module.exports = RegisterKeyCommand
