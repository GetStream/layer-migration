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
      const exportList = await l.exports()
      let allCompleted = true;

      for (let e of exportList) {
        this.log('export is', e);

        if (e.status === 'completed') {
          this.log(`congrats, export with id ${e.id} is completed.`)

          this.log(`ENCRYPTED_AES_KEY=${e.encrypted_aes_key}`)
          this.log(`AES_IV=${e.aes_iv}`)

          this.log(`Your download url is ${e.download_url}`)
        } else {
          allCompleted = false
          this.log(`status for export ${e.id} is ${e.status}`)
        }
      }
      if (allCompleted) {
        this.log('all exports are completed, byebye')
        break;
      }
      // stop if all are completed
      await timeout(5000)
    }
  }
}


StatusCommand.description = `Shows the status of the layer export, note that layer will also send you an email when it's done`




module.exports = StatusCommand
