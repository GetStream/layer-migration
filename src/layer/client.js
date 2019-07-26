const axios = require('axios');
var fs = require('fs');


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
      console.log('data', response.data);
    } catch(e) {
      console.log('whoops', e.response.data);
    }
  }

  async put(path, data) {
    //data['app_uuid'] = this.appUUID;
    console.log("data", data);
    const config = {headers: {}}
    config.headers['Accept'] = 'application/vnd.layer+json; version=3.0'
    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = 'Bearer ' + this.token
    try {
      const response = await axios.put(path, data, config)
      console.log('data', response.data);
    } catch(e) {
      console.log('whoops', e.response.data);
    }
  }

  async get(path, params) {
    params['app_uuid'] = this.appUUID;
    const config = {headers: {}}
    config.headers['Accept'] = 'application/vnd.layer+json; version=3.0'
    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = 'Bearer ' + this.token
    config['params'] = params
    try {
      const response = await axios.get(path, config)
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

  async exports() {
    const path = this.getAppPath() + '/exports';
    const result = await this.get(path, {});
    return result;
  }

  async createExport() {
    const path = this.getAppPath() + '/exports';
    const result = await this.post(path, {});
    return result;
  }

  async registerPublicKey(publicKey) {
    // TODO https://docs.layer.com/reference/server_api/data.out#register-public-key
    const path = this.getAppPath() + '/export_security';
    const result = await this.put(path, {public_key: publicKey});
    return result;
  }

  async exportStatus(exportID) {
    const path = this.getAppPath() + `/exports/${exportID}/status`;
    const result = await this.get(path, {});
    return result;
  }



}

const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN)
var contents = fs.readFileSync('keys/layer-export-pub', 'utf8');

l.exportStatus('62e69b10-af52-11e9-a367-0242ac110006')
