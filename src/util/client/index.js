const axios = require('axios');
const fs = require('fs');

/**
 * A subset of Layer's API functionality, aimed to help you export data from Layer
 */
class LayerChat {
    constructor(appUUID, token) {
        this.appUUID = appUUID;
        this.token = token;

        this.baseURL = 'https://api.layer.com';
    }

    getAppPath() {
        return `${this.baseURL}` + `/apps/${this.appUUID}`;
    }

    async post(path, data, headers) {
        //data.app_uuid = this.appUUID;

        const config = { headers: {} };

        config.headers.Accept = 'application/vnd.layer+json; version=3.0';
        config.headers['Content-Type'] = 'application/json';
        config.headers.Authorization = 'Bearer ' + this.token;

        if (headers) {
            config.headers = Object.assign({}, config.headers, headers);
        }

        try {
            const response = await axios.post(path, data, config);
            return response.data;
        } catch (e) {
            console.log('whoops', e.response.data);
            // TODO: raise an error
        }
    }

    async put(path, data) {
        const config = { headers: {} };

        config.headers.Accept = 'application/vnd.layer+json; version=3.0';
        config.headers['Content-Type'] = 'application/json';
        config.headers.Authorization = 'Bearer ' + this.token;

        try {
            const response = await axios.put(path, data, config);
            return response.data;
        } catch (e) {
            console.log('whoops', e.response.data);
            // TODO: raise an error
        }
    }

    async get(path, params, headers) {
        //params.app_uuid = this.appUUID;
        //

        const config = { headers: {} };

        config.headers.Accept = 'application/vnd.layer+json; version=3.0';
        config.headers['Content-Type'] = 'application/json';
        config.headers.Authorization = 'Bearer ' + this.token;

        if (headers) {
            config.headers = Object.assign({}, config.headers, headers);
        }

        config.params = params;

        try {
            const response = await axios.get(path, config);
            return response.data;
        } catch (e) {
            console.log('whoops', e.response.data);
            // TODO: raise an error
        }
    }

    async createConversation(data) {
        const path = this.getAppPath() + '/conversations';
        const result = await this.post(path, data);

        return result;
    }

    async createIdentity(data) {
        const path = this.getAppPath() + `/users/${data.userID}/identity`;
        const result = await this.post(path, data);

        return result;
    }

    async sendMessage(conversationUUID, data) {
        const path =
            this.getAppPath() + `/conversations/${conversationUUID}/messages`;
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
        const result = await this.put(path, { public_key: publicKey });

        return result;
    }

    async registerWebhook(data) {
        // https://docs.layer.com/reference/webhooks/rest.out#register
        const headers = {};
        headers['Accept'] = 'application/vnd.layer.webhooks+json; version=3.0';
        const path = this.getAppPath() + '/webhooks';
        console.log(data);
        const result = await this.post(path, data, headers);

        return result;
    }

    async webhooks() {
        const headers = {};
        headers['Accept'] = 'application/vnd.layer.webhooks+json; version=3.0';
        const path = this.getAppPath() + '/webhooks';
        const result = await this.get(path, {}, headers);

        return result;
    }

    async exportStatus(exportID) {
        const path = this.getAppPath() + `/exports/${exportID}/status`;
        const result = await this.get(path, {});

        return result;
    }
}

function LayerClientFromEnv() {
    if (!process.env.LAYER_APP_ID) {
        throw Error(`The LAYER_APP_ID environment variable is missing`);
    }
    if (!process.env.LAYER_TOKEN) {
        throw Error(`The LAYER_TOKEN environment variable is missing`);
    }

    const l = new LayerChat(process.env.LAYER_APP_ID, process.env.LAYER_TOKEN);
    return l;
}

module.exports = { Client: LayerChat, LayerClientFromEnv };
