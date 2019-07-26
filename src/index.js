const RegisterKeyCommand = require('./commands/register-key')
const ExportCommand = require('./commands/export')
const MessageCommand = require('./commands/message')
const StatusCommand = require('./commands/status')

const {Command, flags} = require('@oclif/command')

class LayerMigrateCommand extends Command {
  async run() {
    const {flags} = this.parse(LayerMigrateCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/index.js`)
  }
}

LayerMigrateCommand.description = `Describe the command here
...
Extra documentation goes here
`

LayerMigrateCommand.flags = {
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = LayerMigrateCommand
