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

	/**
	 * Small wrapper, returns the response data or raises an error
	 */
	async _handleResponse(responsePromise) {
		try {
			const response = await responsePromise;
			return response.data;
		} catch (e) {
			console.log('error', e.response.data);
			throw e;
		}
	};

	_getAppPath() {
		return `${this.baseURL}` + `/apps/${this.appUUID}`;
	}

	_defaultHeaders() {
		const headers = {};
		headers['Content-Type'] = 'application/json';
		headers.Authorization = 'Bearer ' + this.token;
		return headers;
	};

	_serverHeaders() {
		const headers = this._defaultHeaders();
		headers.Accept = 'application/vnd.layer+json; version=3.0';
		return headers;
	};

	_webHookHeaders() {
		const headers = this._defaultHeaders();
		headers.Accept = 'application/vnd.layer.webhooks+json; version=3.0';
		return headers;
	};

	async post(path, data, headers) {
		if (headers === undefined) {
			headers = this._serverHeaders();
		}
		const config = { headers };
		const responsePromise = axios.post(path, data, config);
		return this._handleResponse(responsePromise);
	}

	async put(path, data) {
		const headers = this._serverHeaders();
		const config = { headers };
		const responsePromise = axios.put(path, data, config);
		return this._handleResponse(responsePromise);
	}

	async get(path, params, headers) {
		if (headers === undefined) {
			headers = this._serverHeaders();
		}
		const config = { headers };
		config.params = params;
		const responsePromise = axios.get(path, config);
		return this._handleResponse(responsePromise);
	}

	async createConversation(data) {
		const path = this._getAppPath() + '/conversations';
		const result = await this.post(path, data);

		return result;
	}

	async conversation(conversationUUID) {
		const path = this._getAppPath() + `/conversations/${conversationUUID}`;
		const data = {app_uuid: this.appUUID}
		const result = await this.get(path, data);

		return result;
	}

	async createIdentity(data) {
		const path = this._getAppPath() + `/users/${data.userID}/identity`;
		const result = await this.post(path, data);

		return result;
	}

	async sendMessage(conversationUUID, data) {
		const path =
			this._getAppPath() + `/conversations/${conversationUUID}/messages`;
		console.log('path', path, data);
		const result = await this.post(path, data);

		return result;
	}

	async exports() {
		const path = this._getAppPath() + '/exports';
		const result = await this.get(path, {});

		return result;
	}

	async createExport() {
		const path = this._getAppPath() + '/exports';
		const result = await this.post(path, {});

		return result;
	}

	async registerPublicKey(publicKey) {
		// TODO https://docs.layer.com/reference/server_api/data.out#register-public-key
		const path = this._getAppPath() + '/export_security';
		const result = await this.put(path, { public_key: publicKey });

		return result;
	}

	async registerWebhook(data) {
		// https://docs.layer.com/reference/webhooks/rest.out#register
		const headers = this._webHookHeaders();
		//data['app_uuid'] = this.appUUID;
		const path = this._getAppPath() + '/webhooks';
		const result = await this.post(path, data, headers);

		return result;
	}

	async webhooks() {
		const headers = this._webHookHeaders();
		const path = this._getAppPath() + '/webhooks';
		const result = await this.get(path, {}, headers);

		return result;
	}

	async exportStatus(exportID) {
		const path = this._getAppPath() + `/exports/${exportID}/status`;
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

module.exports = { Client: LayerChat, LayerClientFromEnv: LayerClientFromEnv };
