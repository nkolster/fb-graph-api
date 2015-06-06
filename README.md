# fb-graph-api

**Simple library to use FB Graph API**

### Version
1.0.1

### Installation

```sh
$ npm install git+https://github.com/nkolster/fb-graph-api.git
```

### Usage

```
var gapi = require('fb-gapi');
var api = new gapi(); // init

api.get({
	uri: '/facebook/picture',
	redirect: 'false'
}).then(function (data) {
	// Do something with data
}, function (error) {
	// Do something with error
});

api.destroy(); //  once done
```

### Init
>new gapi([token, version]);

**arguments**
* token - access token to access the data (default: undefined)
* version - version of FB Graph API (default: v2.3)

**accepted entries for version:**
*  /v2.3
*  v2.3
*  2.3

v2.3 is example, you can set all valid FB Graph API versions

Example:
```
var gapi = require('fb-gapi');
var api = new gapi();
```

**Initialize with arguments**

```
var gapi = require('fb-gapi');
var access_token = 'CAACEdEose1c';
var api = new gapi(access_token);
```

```
var gapi = require('fb-gapi');
var access_token = 'CAACEdEose0c';
var version = '/v2.1';
var api = new gapi(access_token, version);
```

### Methods

**gapi.getToken()**
`// get access token`

> no arguments

>returns string

```
var gapi = require('fb-gapi');
var access_token = 'CAACEdEose0c';
var api = new gapi(access_token);

console.log(api.getToken()); // CAACEdEose0c
```


**gapi.setToken(token)**
`// set access token`
> Arguments:

* token - access token (required)

>returns nothing

```
var gapi = require('fb-gapi');
var access_token = 'CAACEdEose0c';
var api = new gapi();

api.setToken(access_token);
```

**gapi.getVersion()**
`// get version of FB Graph API`

> no arguments

>returns string

```
var gapi = require('fb-gapi');
var api = new gapi();

console.log(api.getVersion()); // /v2.3
```

**gapi.setVersion(version)**
`// set version of FB Graph API`

> Arguments:

* version - version of FB Graph API (required)

>returns nothing

```
var gapi = require('fb-gapi');
var version = '/v2.3';
var api = new gapi();

api.setToken(version);
```

**gapi.destroy()**
`// clear timer`

**Note:** Timer used to escape FB API Graph calls limit (600 requests per 600 second)

> no arguments

>returns nothing

```
var gapi = require('fb-gapi');
var api = new gapi();

// Do anything with the API

api.destroy();
```



**gapi.get(uri[, options])**
`// make a GET request to the FB Graph API`

> Arguments:

* uri - version of FB Graph API or options object (required)
* options - options object

>returns object

```
var gapi = require('fb-gapi');
var access_token = 'CAACEdEose0c';
var api = new gapi(access_token);

api.get('me', {
	fields: 'id,name'
}).then(function (data) { // on success callback
	// Do something with data
}, function (error) { // on error callback
	 // Do something with error
});
```

Or

```
var gapi = require('fb-gapi');
var access_token = 'CAACEdEose0c';
var api = new gapi(access_token);

api.get({
	uri: 'me',
	fields: 'id,name'
}).then(function (data) { // on success callback
	// Do something with data
}, function (error) { // on error callback
	 // Do something with error
});
```
**accepted entries for URI:**
*  /me
*  me

me is example, all valid FB Graph API methods can be used

**POST, PUT & DELETE methods works the same way**

#### Also you can use gapi in your app several times

```
var gapi = require('./fb-gapi');
var api1 = new gapi();
var api2 = new gapi();

api1.setToken('CAACEdEose0c');

api1.get({
	uri: 'me',
	fields: 'id,name'
}).then(function (data) {
	// Do something with data
}, function (error) {
	// Do something with error
});


api2.get({
	uri: '/facebook/picture',
	redirect: 'false'
}).then(function (data) {
	// Do something with data
}, function (error) {
	// Do something with error
});
```

All errors will be logged in text file called **request_log.txt**
