const {Command, flags} = require('@oclif/command')
const fs = require('fs')

const LayerChat = require('../../client')

class ExportCommand extends Command {
  async run() {
    const {flags} = this.parse(ExportCommand)

    const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)

    const res = await l.createExport()
    this.log(res)
  }
}

ExportCommand.description =
  'starts a layer export – note that you need to register a key before this works'

module.exports = ExportCommand
