const {Command, flags} = require('@oclif/command')
var fs = require('fs');
const LayerChat = require('../../../layer/client')

class ExportCommand extends Command {
  async run() {
    const {flags} = this.parse(ExportCommand)

    const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)

    const response = await l.createExport()
    this.log('response is', response);
  }
}


ExportCommand.description = `Starts a Layer export, note that you need to register a key before this works`




module.exports = ExportCommand
