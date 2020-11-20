(function() {
    var global = this;
    if (typeof window !== 'undefined') {
        global = window;
    }

    var utils = function() {
        'use strict';

        function _instanceof(left, right) {
            if (
                right != null &&
                typeof Symbol !== "undefined" &&
                right[Symbol.hasInstance]
            ) {
                return !!right[Symbol.hasInstance](left);
            } else {
                return left instanceof right;
            }
        }

        function _extend(left, right) {
            if (_instanceof(right, Object)) {
                Object.keys(right).forEach(function(k) {
                    try {
                        if (left.hasOwnProperty(k) && !_instanceof(right[k], Object)) {
                            left[k] = right[k];
                        } else {
                            _extend(left[k], right[k]);
                        }
                    } catch (err) {
                        console.error("Error:extend", err);
                    }
                });
            }
        }

        function isNull(obj) {
            return obj === null;
        }

        function isSet(obj) {
            return typeof obj !== "undefined"; // return typeof obj !== undefined;
        }

        function isArray(obj) {
            if (typeof Array.isArray === "undefined") {
                return Object.prototype.toString.call(obj) === "[object Array]";
            } else {
                return Array.isArray(obj);
            }
        }

        function goTo(uri, conf) {
            var _url = '/' + uri,
                _conf = {
                    ext: false,
                    delay: false
                }

            extend(_conf, (conf || {}))

            if(_conf.ext){
                _url = uri;
            }

            console.log("goto: ", _url);

            try {
                if(_conf.delay){
                    setTimeout(function(){
                        window.location.href = _url;
                    }, parseInt(_conf.delay));
                }else{
                    window.location.href = _url;
                }
            } catch (err) {
                console.log(err);
            }

            return _url;
        }

        function getUrlVars() {
            var vars = {};
            var regex = /[?&]+([^=&]+)=([^&]*)/gi;

            try {
                window.location.href.replace(regex, function(m, key, value) {
                    vars[key] = value;
                });
            } catch (err) {
                console.log("window object not available");
            }

            return vars;
        }

        function getUrlParam(parameter, defaultvalue) {
            var urlparameter = defaultvalue;

            if (window.location.href.indexOf(parameter) > -1) {
                urlparameter = getUrlVars()[parameter];
            }

            return urlparameter;
        }

        function serialize(obj) {
            var str = [];

            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }

            return str.join("&");
        }

        function isEmail(ve) {
            var flt = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return flt.test(ve);
        }

        var utils = {
            isNull: isNull,
            isSet: isSet,
            isArray: isArray,
            goTo: goTo,
            getUrlVars: getUrlVars,
            getUrlParam: getUrlParam,
            serialize: serialize,
            isEmail: isEmail,
            extend: _extend,
            instanceof: _instanceof
        };
        return utils;
    }();

    var manager = function() {
        'use strict';

        var _models = {},
            _ready = false;

        function addmodel(mv) {
            _models[mv.uid] = mv;
            return mv;
        }

        function getmodel(uid) {
            if(_models.hasOwnProperty(uid)){
                return _models[uid];
            }
            return null;
        }

        function reg(mv) {
            var model = getmodel(mv.uid);

            if(utils.isNull(model)){
                model = addmodel(mv)
            }

            if (!!_ready){
                model.init();
            }

            return model;
        }

        function boot() {
            Object.keys(_models).forEach(function(k) {
                getmodel(k).init()
            });
            _ready++;
        }

        return {
            reg: reg,
            boot: boot,
            find: getmodel
        };
    }();

    var arc = function() {
        'use strict';

        var _lvls = ["[info]", "[warn]", "[error]"],
            _modules = [];

        var arc = function arc() {
            // enforces new
            if (!utils.instanceof(this, arc)) {
                return new arc();
            }

            this.conf = {
                stdout: true,
                utils: {
                    global: true
                },
                api: {
                    httpMethods: ["GET", "POST", "PUT", "DELETE"],
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        Allow: "*"
                    },
                    gateway: {
                        key: null,
                        invoke_url: null
                    }
                },
                session: {
                    ctx_glob: false
                },
                cognito: {
                    poolId: null,
                    region: "us-east-1",
                    domain: null,
                    clientId: null,
                    endpoints: {
                        redirectUri: null,
                        authorize: {
                            path: "/oauth2/authorize",
                            qs: "response_type=code&scope=openid+profile+aws.cognito.signin.user.admin&state=STATE"
                        }
                    }
                }
            };

            Object.keys(utils).forEach(function(k) {
                if (!this.hasOwnProperty(k)) {
                    this[k] = utils[k];
                }
            }, this);

            this.peers = {};
        };


        function checkPeers(mod) {
            try {
                if (mod.hasOwnProperty("peers")) {
                    mod.peers.forEach(function(peer) {
                        if (!global.hasOwnProperty(peer)) {
                            throw new Error("´Missing Dependency");
                        }else{
                            this[peer] = global[peer];
                        }
                    }, this);
                }

                return true;
            } catch (err) {
                return false;
            }
        }

        function initModules() {
            _modules.forEach(function(mod) {
                if (!mod.hasOwnProperty("ready")
                    && checkPeers.call(this, mod)) {
                        this[mod.name] = new mod.ref(this);
                        mod.ready = true;

                        if(this.conf.hasOwnProperty(mod.name) &&
                            this.conf[mod.name].hasOwnProperty('ctx_glob') &&
                            this.conf[mod.name].ctx_glob){
                            global[mod.name] = this[mod.name];
                        }
                }
            }, this);
        }

        arc.prototype = {

            log: function log(lvl, msg, data) {
                console.log(_lvls[parseInt(lvl) - 1], msg, data || "");
            },

            exports: function exports(mod) {
                console.log("exports: ", mod.name);
                _modules.push(mod);
            },

            init: function init(conf, g) {
                utils.extend(this.conf, conf);

                if(typeof g !== 'undefined'){
                    global = g;
                }

                if (this.conf.utils.global) {
                    Object.keys(utils).forEach(function(k) {
                        if (!global.hasOwnProperty(k)) {
                            global[k] = utils[k];
                        }
                    });
                }

                initModules.call(this);
            },

            boot: function boot() {
                manager.boot();
            },

            find: function find(uid) {
                return manager.find(uid);
            },

            reg: function reg(mv){
                return manager.reg(mv)
            }
        };
        return arc;
    }();

    try {
        module.exports = new arc();
    } catch (err) {
        this.arc = new arc();
    }

}).apply(this);