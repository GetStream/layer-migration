const {Command, flags} = require('@oclif/command')
const fs = require('fs')

const LayerChat = require('../../client')

class MessageCommand extends Command {
  async run() {
    const {flags} = this.parse(MessageCommand)

    const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)
    const res = await l.sendMessage(flags.conversation, flags.data)

    this.log(res)
  }
}

MessageCommand.description = 'creates a new message in layer'

MessageCommand.flags = {
  conversation: flags.string({
    char: 'c',
    description: 'the uuid of your conversation',
  }),
  data: flags.string({
    char: 'd',
    description: 'the data for your conversation',
  }),
}

module.exports = MessageCommand
