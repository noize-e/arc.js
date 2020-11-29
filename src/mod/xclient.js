// @module [public] Sestg
(function(arc) {
    'use strict';

    var xclient = (function(arc) {
        'use strict';

        xclient.ref = "xclient"
        xclient.public = true
        xclient.peers = ["jQuery"]

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

        function xclient(arc, conf) {
            if (!(this instanceof xclient)) {
                return new xclient(arc, conf)
            }

            var _queryString = null,
                _requestHandler = arc.jQuery.ajax,
                _invokeUrl = conf.gateway.invoke_url,
                _httpMethods = conf.httpMethods,
                /*
                 * By default all request are treated as 'application/json' type.
                 * For Cross Origin Resource Sharing the 'Allow' header is set
                 * with a wildcard scope.
                 */
                _requestConfig = {
                    contentType: conf.contentType,
                    dataType: conf.dataType,
                    headers: conf.headers
                };

                _requestConfig.headers["x-api-key"] = conf.gateway.key;


            function validateHttpMethod(method) {
                if (_httpMethods.indexOf(method) < 0) {
                    throw new Error("InvalidMethod");
                }

                return method;
            }

            var _clientManager = {
                templateUri: function templateUri(uri, rawqs) {
                    var _url = _invokeUrl + uri;

                    var _queryString = null;

                    if (arc.isNull(rawqs)) {
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
                makeRequest: function makeRequest(_req, callback, onError) {
                    _requestConfig.method = validateHttpMethod(_req.method);
                    _requestConfig.url = _clientManager.templateUri(
                        _req.path,
                        _req.queryString
                    ); //if (isSet(_req.payload) && !isNull(_req.payload)) {

                    if (!arc.isNull(_req.payload)) {
                        _requestConfig.data = _clientManager.parsePayloadBody(_req.payload);
                    } else {
                        _requestConfig.data = null;

                        try {
                            delete _requestConfig.data;
                        } catch (err) {
                            alert(err);
                        }
                    }

                    if (arc.isNull(_requestHandler)) {
                        throw new Error("InvalidXHR");
                    }

                    if(arc.isSet(onError)){
                        _requestHandler(_requestConfig).done(callback).fail(onError)
                    }else{
                        // legacy compatibility
                        _requestHandler(_requestConfig).always(callback);
                    }
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

            this.get = function(urlPath, queryString, callback, onError) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "GET",
                        queryString: queryString,
                        payload: null
                    },
                    callback,
                    onError
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

            this.post = function(urlPath, queryString, payloadBody, callback, onError) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "POST",
                        queryString: queryString,
                        payload: payloadBody
                    },
                    callback,
                    onError
                );
            };

            this.put = function(urlPath, queryString, payloadBody, callback, onError) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "PUT",
                        queryString: queryString,
                        payload: payloadBody
                    },
                    callback,
                    onError
                );
            };

            this.delete = function(urlPath, queryString, payloadBody, callback, onError) {
                _clientManager.makeRequest({
                        path: urlPath,
                        method: "DELETE",
                        queryString: queryString,
                        payload: payloadBody
                    },
                    callback,
                    onError
                );
            };
        };

        return xclient;
    }(arc));

    arc.add_mod(xclient)

}(this.arc));