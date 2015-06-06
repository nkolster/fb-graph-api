var request = require('request');
var extend = require('util')._extend;
var fs = require('fs');
var method = gapi.prototype;


function gapi(token, version) {
	this._endpoint = 'https://graph.facebook.com';
	this._version = normalizeVersion(version) || '/v2.3';
	this._token = token;
	this._limit = 600;
	this._callsCount = 0;
	this._stack = [];
	this._timer;

	this.startTimer();
}

/* Methods */

method.getToken = function() {
	return this._token;
};

method.setToken = function(token) {
	if(!token) throw new Error('first argument required for this method');
	this._token = token;
};

method.getVersion = function() {
	return this._version;
};

method.setVersion = function(version) {
	if(!version) throw new Error('first argument required for this method');
	this._version = version;
};

method.startTimer = function() {
	var self = this;
	this._timer = setInterval(function() {
		self._callsCount = 0;
		for (var i = 0; i < self._stack.length; i++) {
			self._stack[i].func.call();
			// remove call from stack
			self._stack.splice(i, 1);
		}
	}, 6000);
};

method._request = function(params) {
	var uriParams = '?';
	var token = this.getToken();
	var uri = this._endpoint + this._version + params.uri;
	var a = function(){};
	var self = this;
	if(token){
		uriParams = uriParams + 'access_token=' + token;
	}
	for(key in params){
		if(key !== 'uri'){
			var ampersand = (uriParams.length > 1) ? '&' : '';

			uriParams = uriParams + ampersand + key + '=' + params[key];
		}
	}

	if(uriParams.length > 1) uri = uri + uriParams;

	a.prototype.then = function (onFulfilled, onRejected){
		var a = self._callsCount < self._limit;
		if(self._callsCount < self._limit){
			request(uri, function(error, response, body){
				if(!error && response.statusCode == 200) onFulfilled(body);
				else {
					var err = error || body || 'unknown error';
					logErrorInFile(err);
					onRejected(err);
				}
			});
			self._callsCount++;
		} else	{
			var object = {
			   func: function() {
			   		request(uri, function(error, response, body){
			   			if(!error && response.statusCode == 200) onFulfilled(body);
			   			else {
			   				var err = error || body || 'unknown error';
			   				logErrorInFile(err);
			   				onRejected(err);
			   			}
			   		});
			   }
			}
			self._stack.push(object);
		}
	};

	return new a();
};

method.destroy = function(){
	clearInterval(this._timer);
}

// GET, POST, PUT & DELETE methods
method.get = verbFunc('get');
method.post = verbFunc('post');
method.put = verbFunc('put');
method.del = verbFunc('delete');

// Helper functions

function normalizeVersion(val) {
	if(!val || !val.length || val.length < 3 || val.indexOf('.') == -1) return false;
	var length = val.length;

	if(val[0] !== '/' && val[0] == 'v' && length > 3){
		val = '/' + val;
	}
	if(val[0] !== '/' && val[0] !== 'v' && length == 3){
		val  = '/v' + val;
	}

	if(val[0] == '/' && val[1] == 'v' && length == 5){
		return val;
	}
	return false;
}

// organize params for get, post, put, del
function initParams(uri, options) {
	if(typeof uri === 'string' && uri[0] !== '/'){
		uri = '/' + uri;
	}
	if(typeof uri === 'object' && uri.uri && uri.uri[0] !== '/'){
		uri.uri = '/' +  uri.uri;
	}

	var params = {};
	if (typeof options === 'object') {
		params = extend({}, options);
		params = extend(params, {uri: uri});
	} else if (typeof uri === 'string') {
		params = extend({}, {uri: uri});
	} else {
		params = extend({}, uri);
	}

	return params;
}

function verbFunc (verb) {
	var method = verb.toUpperCase();
	return function (uri, options) {
		var params = initParams(uri, options);
		params.method = method;
		return this._request(params);
	};
}

function logErrorInFile(error){
	var path = 'request_log.txt';
	var text = (error) ? error : 'unkown error';
	text = text + '\n';
	fs.exists(path, function (exists) {
		if(exists){
			fs.appendFile(path, text, function (err) {
				if (err) throw err;
			});
		}
		else {
			fs.writeFile(path, text, function (err) {
			 	if (err) throw err;
			});
		}
	});
}


// Exports

module.exports = gapi;
