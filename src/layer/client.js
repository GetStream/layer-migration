const axios = require('axios');

class LayerChat {
  constructor(appID, token) {
    this.appID = appID;
    this.appUUID = appID.split('/')[appID.split('/').length-1]
    this.token = token;

    this.baseURL = 'https://api.layer.com'
  }

  getAppPath() {
    return `${this.baseURL}` + `/apps/${this.appUUID}`;
  }

  async post(path, data) {
    data['app_uuid'] = this.appUUID;
    const config = {headers: {}}
    config.headers['Accept'] = 'application/vnd.layer+json; version=3.0'
    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = 'Bearer ' + this.token
    try {
      const response = await axios.post(path, data, config)
      console.log('response', response);
      console.log('data', response.data);
    } catch(e) {
      console.log('whoops', e.response.data);
    }
  }

  async createConversation(data) {
    const path = this.getAppPath() + '/conversations';
    const result = await this.post(path, data);
    return result;
  }

  async export() {
    const path = this.getAppPath() + '/conversations';
    const result = await this.post(path, data);
    return result;
  }



}

const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)
l.createConversation({participants: ['abcd']})
