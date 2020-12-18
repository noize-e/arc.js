;(function(arc) {
    'use strict';

    var nss = [],
    conf = {
        stdout: {
            log: true,
            debug: true,
            warn: true,
            error: true
        },
        utils: {
            global: true
        },
        xclient: {
            httpMethods: ["GET", "POST", "PUT", "DELETE"],
            contentType: "application/json",
            dataType: "json",
            headers: {},
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

    Object.defineProperties(arc, {
        get_conf: {
            value: function(modname){
                if(conf.hasOwnProperty(modname)){
                    return conf[modname]
                }
                return null;
            },
            configurable: false,
            enumerable: false,
            writable: false
        },
        load_conf: {
            value: function(_conf) {
                arc.u.extend(conf, _conf);
            },
            configurable: false,
            enumerable: false,
            writable: false
        },
        conf: {
            configurable: false,
            enumerable: false,
            get: function(){
                return function(key){
                    if(conf.hasOwnProperty(key)){
                        return conf[key]
                    }
                    return null;
                }
            },
            set: function(_conf){
                this.u.extend(conf, _conf)
            }
        },
        namespace: {
            writable: false,
            configurable: false,
            enumerable: false,
            value: function(ns){
                Object.defineProperty(this, ns, {
                    value: {},
                    configurable: false,
                    enumerable: false
                })

                Object.defineProperties(this[ns], {
                    property: {
                        value: function(name, spec) {
                            arc.u.extend(spec, {
                                configurable: false,
                                enumerable: false,
                            })

                            if(spec.hasOwnProperty('value')){
                                arc.u.extend(spec, {
                                    writable: false
                                })
                            }

                            Object.defineProperty(this, name, spec)
                        },
                        configurable: false,
                        enumerable: false,
                        writable: false
                    },
                    properties: {
                        value: function(props, settings){
                            var _props = {}
                            Object.keys(props).forEach(function(prop){
                                if(!this.hasOwnProperty(prop)){
                                    _props[prop] = {
                                        value: props[prop]
                                    }

                                    Object.keys(settings).forEach(function(key){
                                        if(!_props[prop].hasOwnProperty(key)){
                                            _props[prop][key] = settings[key]
                                        }
                                    })
                                }
                            }, this);

                            Object.defineProperties(this, _props);

                            return this;
                        },
                        configurable: false,
                        enumerable: false,
                        writable: false
                    },
                    lock: {
                        value: function(){
                            Object.freeze(this);
                        },
                        configurable: false,
                        enumerable: false,
                        writable: false
                    }
                })
            }
        },
    })


    arc.namespace("c")
    /**
     * Console logs
     */

    function logger(level, msg, data, type){
        var label = "[$]", action = "log";
        if(level == 2){
            action = "warn";
        } else if(level == 3){
            action = "error";
        }

        if(level == 4){
            label = label.replace("$", "debug");
        }else{
            label = label.replace("$", action);
        }


        if(arc.u.isSet(data) && arc.u.isObj(data)){
            console.group(label)
            console[action](":: %s ::", msg);
            console[(type || "table")](data);
            console.groupEnd(label)
        }else{
            console[action](":: %s ::\n%s", label, msg, (data || ""));
        }
    }

    arc.c.properties({
        log: function log(msg, data, type) {
            if(conf.stdout.log){
                logger(1, msg, data, type)
            }
        },
        debug: function debug(msg, data, type) {
            if(conf.stdout.debug){
                logger(4, msg, data, type)
            }
        },
        warn: function warn(msg, data, type) {
            if(conf.stdout.warn){
                logger(2, msg, data, type)
            }
        },
        err: function err(msg, data, type) {
            if(conf.stdout.error){
                logger(3, msg, data, type)
            }
        }

    }, {
        writable: false,
        configurable: false,
        enumerable: true
    }).lock();

}(this.arc = this.arc || {}));