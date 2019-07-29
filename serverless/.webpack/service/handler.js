(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../src/client/index.js":
/*!******************************!*\
  !*** ../src/client/index.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const axios = __webpack_require__(/*! axios */ "axios");
const fs = __webpack_require__(/*! fs */ "fs");

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


/***/ }),

/***/ "./handler.js":
/*!********************!*\
  !*** ./handler.js ***!
  \********************/
/*! exports provided: layer, verify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layer", function() { return layer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verify", function() { return verify; });
/* harmony import */ var stream_chat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stream-chat */ "stream-chat");
/* harmony import */ var stream_chat__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(stream_chat__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




var LayerChat = __webpack_require__(/*! ../src/client */ "../src/client/index.js");

var STREAM_CHAT_TYPE = 'messaging';

function getUUIDFromURL(url) {
  var parts = url.split('/');

  if (parts.length) {
    return parts[parts.length - 1];
  }
}
/**
 * getStreamClient - returns the Stream Chat client
 *
 * @returns {object}  Stream chat client
 */


function getStreamClient() {
  if (!process.env.STREAM_API_KEY) {
    throw Error("Environment variable STREAM_API_KEY is not defined");
  }

  if (!process.env.STREAM_API_SECRET) {
    throw Error("Environment variable STREAM_API_SECRET is not defined");
  }

  var client = new stream_chat__WEBPACK_IMPORTED_MODULE_0__["StreamChat"](process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
  return client;
}

function convertUser(data) {
  // TODO: handle the extra fields...
  return {
    id: data.message.sender.user_id
  };
}

function convertPartToAttachment(part) {
  // TODO: Verify how this works
  // Lot of flexibility in terms of message types...
  // https://docs.layer.com/xdk/webxdk/messages#message-parts
  var t = part.mime_type;
  var attachment = Object.assign({}, part);

  if (t === 'application/json') {
    attachment = Object.assign(attachment, JSON.parse(part.body));
  } else if (t.indexOf('image') !== -1) {
    attachment.type = 'image';
    attachment.thumb_url = part.url;
  }

  return attachment;
}

function convertMessage(data, user) {
  // TODO: Verify we handle all edge cases with message parts
  var parts = data.message.parts;
  var message = data.message;
  var messageUUID = getUUIDFromURL(message.id);
  var text = '';

  if (parts[0].mime_type === 'text/plain') {
    text = parts[0].body;
  }

  var attachments = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      if (part.mime_type !== 'text/plain') {
        attachments.append(convertPartToAttachment(part));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var streamMessage = {
    user: user,
    text: text,
    //created_at: message.sent_at,
    id: messageUUID,
    attachments: attachments
  };
  return streamMessage;
}

function convertChannel(_x) {
  return _convertChannel.apply(this, arguments);
}

function _convertChannel() {
  _convertChannel = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(data) {
    var conversationURL, conversationUUID, l, conversation, streamChannel, members, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, p;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // TODO: handle distinct..
            // https://docs.layer.com/sdk/web/conversations#distinct-conversations
            //
            // TODO: handle createdBy
            conversationURL = data.message.conversation.id;
            conversationUUID = conversationURL.split('/')[conversationURL.split('/').length - 1];
            l = LayerChat.LayerClientFromEnv();
            _context3.next = 5;
            return l.conversation(conversationUUID);

          case 5:
            conversation = _context3.sent;
            // channels are pretty similar to conversations...
            // metadata needs to be imploded
            // created_at and updated_at are the same
            // id and chat type are different
            streamChannel = conversation.metadata || {};
            streamChannel.type = STREAM_CHAT_TYPE;
            streamChannel.id = conversationUUID;
            streamChannel.created_at = conversation.created_at;
            streamChannel.updated_at = conversation.updated_at;
            streamChannel.layer_conversation_id = conversationUUID;
            streamChannel.sync_source = 'webhook';
            members = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 17;

            for (_iterator2 = conversation.participants[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              p = _step2.value;
              members.push(p.user_id);
            }

            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](17);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 25:
            _context3.prev = 25;
            _context3.prev = 26;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 28:
            _context3.prev = 28;

            if (!_didIteratorError2) {
              _context3.next = 31;
              break;
            }

            throw _iteratorError2;

          case 31:
            return _context3.finish(28);

          case 32:
            return _context3.finish(25);

          case 33:
            streamChannel.members = members;
            return _context3.abrupt("return", streamChannel);

          case 35:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[17, 21, 25, 33], [26,, 28, 32]]);
  }));
  return _convertChannel.apply(this, arguments);
}

var layer =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(event) {
    var data, channel, user, message, chatClient, streamChannel;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = JSON.parse(event.body); // - validate the payload: https://docs.layer.com/reference/webhooks/payloads#validating-payload-integrity
            // - parse the layer webhook event
            // - figure out the corresponding stream channel
            // - convert the message
            // - write the message to Stream
            // TODO: validate the payload

            if (!(data.event.type !== 'Message.created')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                error: 'not able to handle events of this type...'
              })
            });

          case 3:
            _context.next = 5;
            return convertChannel(data);

          case 5:
            channel = _context.sent;
            user = convertUser(data);
            message = convertMessage(data, user);
            console.log('converted channel', channel);
            console.log('converted user', user);
            console.log('converted message', message); // lookup the conversation...

            chatClient = getStreamClient();
            streamChannel = chatClient.channel(channel.type, channel.id, {
              created_by: {
                id: 'layer_sync',
                name: 'layer sync'
              }
            });
            _context.next = 15;
            return streamChannel.create();

          case 15:
            _context.next = 17;
            return streamChannel.sendMessage(message);

          case 17:
            return _context.abrupt("return", {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                data: data
              })
            });

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function layer(_x2) {
    return _ref.apply(this, arguments);
  };
}();
var verify =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(event) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", // return the verification_challenge param
            {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*'
              },
              body: event.queryStringParameters.verification_challenge
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function verify(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "stream-chat":
/*!******************************!*\
  !*** external "stream-chat" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream-chat");

/***/ })

/******/ })));
//# sourceMappingURL=handler.js.map