/**
 *
 *  CHANGELOG - 7/Nov/2020
 *
 *  1. Modified: XHRClient class name now is XClient.
 *  2. Added: XClient implements  2 new methods: 'put' & 'delete'
 *  3. Added: Test spec: 'src/test/core.xhr.xclient.spec.js'
 *
 *  USAGE
 *
 *      let config = {
 *           api_gateway: {
 *              key: "IJqIDOA6x06SQh9fXtnnNrVhicdu1wH7Zv6Rgvuc",
 *              invoke_url: "https://api-canibal-admin.wirdlog.com/v1"
 *          }
 *      };
 *
 *      let xclient = new XClient();
 *      xclient.setRequestHandler($.ajax);
 *      xclient.setApiSettings(
 *           config.api_gateway.key,
 *           config.api_gateway.invoke_url);
 *
 *      xclient.setAuthorization(Session.getIdToken());
 *
 */
(function core_xhr_xclient(arc) {
    var HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"],
        modexport = {
            name: "xclient"
        };

    modexport.ref = (function() {
        'use strict';

        function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                _typeof = function _typeof(obj) {
                    return obj &&
                        typeof Symbol === "function" &&
                        obj.constructor === Symbol &&
                        obj !== Symbol.prototype ?
                        "symbol" :
                        typeof obj;
                };
            }
            return _typeof(obj);
        }

        var xclient = function xclient() {
            var _queryString = null,
                _invokeUrl,
                _requestHandler,

                /*
                 * By default all request are treated as 'application/json' type.
                 * For Cross Origin Resource Sharing the 'Allow' header is set
                 * with a wildcard scope.
                 */
                _requestConfig = {
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        Allow: "*"
                    }
                };

            function validateHttpMethod(method) {
                if (HTTP_METHODS.indexOf(method) < 0) {
                    throw new Error("InvalidMethod");
                }

                return method;
            }

            var _clientManager = {
                templateUri: function templateUri(uri, rawqs) {
                    var _url = _invokeUrl + uri;

                    var _queryString = null;

                    if (isNull(rawqs)) {
                        return _url;
                    }

                    if (_typeof(rawqs) === "object" && Object.keys(rawqs) > 0) {
                        Object.keys(rawqs).forEach(function(key) {
                            _queryString += _queryString ? "&" : "?";
                            _queryString += key + "=" + this[key];
                        }, rawqs);
                        return _url + _queryString;
                    }

                    return _url;
                },
                parsePayloadBody: function parsePayloadBody(payloadBody) {
                    var body = "";

                    if (_requestConfig.contentType == "application/json") {
                        body = JSON.stringify(payloadBody || {});
                    } else {
                        Object.keys(payloadBody).forEach(function(key) {
                            body += body != "" ? "&" : "";
                            body += key + "=" + this[key];
                        }, payloadBody);
                    }

                    return body;
                },
                makeRequest: function makeRequest(_req, completeCallback) {
                    _requestConfig.method = validateHttpMethod(_req.method);
                    _requestConfig.url = _clientManager.templateUri(
                        _req.path,
                        _req.queryString
                    ); //if (isSet(_req.payload) && !isNull(_req.payload)) {

                    if (!isNull(_req.payload)) {
                        _requestConfig.data = _clientManager.parsePayloadBody(_req.payload);
                    } else {
                        _requestConfig.data = null;

                        try {
                            delete _requestConfig.data;
                        } catch (err) {
                            alert(err);
                        }
                    }

                    if (isNull(_requestHandler)) {
                        throw new Error("InvalidXHR");
                    }

                    _requestHandler(_requestConfig).always(completeCallback);
                }
            };
            /**
             * [setContentType description]
             * @param {[type]} ct [description]
             */

            this.setContentType = function setContentType(ct) {
                _requestConfig.contentType = ct;
            };
            /**
             * Set Authentication Header.
             * @param {string} token -- Sets the header 'Authorization'with a
             * pre-defined token hash.
             */

            this.setAuthorization = function setAuthorization(token) {
                // Designed to work with Cognito Authentication service.
                _requestConfig.headers["Authorization"] = token;
            };
            /**
             * Setup the API settings
             * @param {string} apiKey    Sets the header 'x-api-key' with a pre-defined hash key.
             *                           Designed to work with Amazon API Gateway service.
             * @param {string} invokeUrl Sets the API url.
             */

            this.setApiSettings = function(apiKey, invokeUrl) {
                if (apiKey) {
                    _requestConfig.headers["x-api-key"] = apiKey;
                }

                if (invokeUrl) {
                    _invokeUrl = invokeUrl;
                }
            };
            /**
             * Setup a Xml Http Request Handler
             * @param {object} requestHandler, Object in charge of perform the async server calls.
             *                                 Designed to work with jQuery $.ajax object methods.
             */

            this.setRequestHandler = function(requestHandler) {
                _requestHandler = requestHandler;
            };
            /**
             * Perform a HTTP POST method request to an API endpoint
             * @param  {string}   urlPath     API endpoint path, must include '/' at the begin.
             * @param  {object}   queryString URL Parameters object
             * @param  {function} callback    Executed on complete request
             *                                Designed to be agnostic to the response code.
             */

            this.get = function(urlPath, queryString, callback) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "GET",
                        queryString: queryString,
                        payload: null
                    },
                    callback
                );
            };
            /**
             * Consume an enpoint by HTTP POST Request
             *
             * @param  {string}   urlPath        API Endpoint path, must include '/' at the begin.
             * @param  {object}   queryString    URL Parameters object
             * @param  {object}   payloadBody    Raw body object sent in POST requests
             * @param  {function} callback       Executed on complete request
             *                                   Designed to be agnostic to the response code.
             */

            this.post = function(urlPath, queryString, payloadBody, callback) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "POST",
                        queryString: queryString,
                        payload: payloadBody
                    },
                    callback
                );
            };

            this.put = function(urlPath, queryString, payloadBody, callback) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "PUT",
                        queryString: queryString,
                        payload: payloadBody
                    },
                    callback
                );
            };

            this.delete = function(urlPath, queryString, payloadBody, callback) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "DELETE",
                        queryString: queryString,
                        payload: payloadBody
                    },
                    callback
                );
            };
        };

        return xclient;
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }

}).apply(this);