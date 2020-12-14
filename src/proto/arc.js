/**
 * CoreModule: Arc
 * Namespacing Status:
 *  arc.u: ok
 */
;(function(arc) {
    'use strict';

    var conf = {
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

    // @public
    arc.get_conf = function(modname){
        if(conf.hasOwnProperty(modname)){
            return conf[modname]
        }
        return null;
    }

    // @public
    arc.load_conf = function(_conf) {
        arc.u.extend(conf, _conf);
    }


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

    // @public
    function log(msg, data, type) {
        if(conf.stdout.log){
            logger(1, msg, data, type)
        }
    }

    function debug(msg, data, type) {
        if(conf.stdout.debug){
            logger(4, msg, data, type)
        }
    }

    function warn(msg, data, type) {
        if(conf.stdout.warn){
            logger(2, msg, data, type)
        }
    }

    function err(msg, data, type) {
        if(conf.stdout.error){
            logger(3, msg, data, type)
        }
    }

    arc.c = {
        log: log,
        debug: debug,
        warn: warn,
        err: err
    }

}(this.arc = this.arc || {}));