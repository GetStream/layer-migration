const {Command, flags} = require('@oclif/command')
var fs = require('fs');
const LayerChat = require('../../../layer/client')

function timeout(delayms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delayms);
    });
}

class StatusCommand extends Command {
  async run() {
    const {flags} = this.parse(StatusCommand)

    const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)

    while (true) {
      const response = await l.exports()
      this.log('response is', response);
      await timeout(5000)
    }
  }
}


StatusCommand.description = `Shows the status of the layer export, note that layer will also send you an email when it's done`




module.exports = StatusCommand
