/**
 * CoreModule: Arc
 * Namespacing Status:
 *  arc.u: ok
 */
;(function(arc) {
    'use strict';

    var debug = true,
        conf = {
            stdout: {
                log: true,
                debug: false,
                warn: true,
                error: false
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


    function log(level, msg, data, type){
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

        console.group(label)
        if(arc.u.isSet(data) && arc.u.isObj(data)){
            console[action](":: %s ::", msg);
            console[(type || "table")](data);
        }else{
            console[action]("%s :: %s ::", msg, (data || ""));
        }
        console.groupEnd(label)
    }

    // @public
    arc.log = function(msg, data, type) {
        if((arc.get_conf("stdout")).log){
            log(1, msg, data, type)
        }
    }

    arc.debug = function(msg, data, type) {
        if((arc.get_conf("stdout")).debug){
            log(4, msg, data, type)
        }
    }

    arc.warn = function(msg, data, type) {
        if((arc.get_conf("stdout")).warn){
            log(2, msg, data, type)
        }
    }

    arc.err = function(msg, data, type) {
        if((arc.get_conf("stdout")).error){
            log(3, msg, data, type)
        }
    }

    arc.datalog = function(data, type) {
        console.group("datalog")
        if(arc.u.isSet(type) && type == "tree"){
            console.log(data);
        }else{
            console.table(data);
        }
        console.groupEnd("datalog")
    }

}(this.arc = this.arc || {}));