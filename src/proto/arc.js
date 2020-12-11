// @module [public] Arc
;(function(arc) {
    'use strict';

    var debug = true,
        conf = {
            stdout: {
                debug: true
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

    // @public
    arc.get_conf = function(modname){
        if(conf.hasOwnProperty(modname)){
            return conf[modname]
        }
        return null;
    }

    // @public
    arc.load_conf = function(_conf) {
        arc.extend(conf, _conf);
    }


    function log(level, msg, data, type){
        var action = "log";
        if(level == 2){
            action = "warn";
        } else if(level == 3){
            action = "error";
        }

        var label = "[$]".replace("$", action);
        if(arc.isSet(data) && arc.isObj(data)){
            console.group(label)
            console[action](":: %s ::", msg);
            console[(type || "table")](data);
            console.groupEnd(label)
        }else{
            console[action]("%s :: %s %s ::", label, msg, (data || ""));
        }
    }

    // @public
    arc.log = function(msg, data, type) {
        log(1, msg, data, type)
    }

    arc.debug = function(msg, data, type) {
        if((arc.get_conf("stdout")).debug){
            log(1, msg, data, type)
        }
    }

    arc.warn = function(msg, data, type) {
        log(2, msg, data, type)
    }

    arc.err = function(msg, data, type) {
        log(3, msg, data, type)
    }

    arc.datalog = function(data, type) {
        console.group("datalog")
        if(arc.isSet(type) && type == "tree"){
            console.log(data);
        }else{
            console.table(data);
        }
        console.groupEnd("datalog")
    }

}(this.arc = this.arc || {}));