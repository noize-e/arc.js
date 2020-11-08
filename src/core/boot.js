(function(){

    var lvls = ["[info]", "[warn]", "[error]"];
    var arc = {
        mods: [],
        models: {},
        deps: {
            window: null
        }
    }

    arc.stdout = !1;
    arc.log = function(lvl, msg, data){
        if(arc.stdout)
            console.log(lvls[(parseInt(lvl)-1)], msg, (data || ''))
    }

    arc.deps.document = {
        getElementById: function(identity) {
            // console.log("[mockup] getElementById", identity)
            return {
                identity: identity,
                className: "mockup-classname"
            }
        }
    }

    arc.deps.ko = {
        observable: function(args) {
            // console.log("[mockup] observable", arguments);
            return this.observable
        },
        applyBindings: function(args){
            // console.log("[mockup] applyBindings", arguments);
            return this.applyBindings
        }
    }

    arc.deps.aws = {
        region: "",
        cognito: {
            sdk: {
                config: {
                    region: "us-west-1"
                }
            },
            pool_id: "",
            pool_client_id: "",
            identity: {
                CognitoUser: function(d){
                    return {
                        authenticateUser: function(dt, cbs){
                            cbs.onSuccess("<CognitoUser::authenticateUser.onSuccess( {data} )>")
                            cbs.onFailure("<CognitoUser::authenticateUser.onFailure( {error} )>")
                        },
                        confirmRegistration: function(cb){},
                        resendConfirmationCode: function(cb){},
                        forgotPassword: function(cbs){
                            cbs.onSuccess("<CognitoUser::forgotPassword.onSuccess( {data} )")
                            cbs.onFailure("<CognitoUser::forgotPassword.onFailure( {error} )>")
                        },
                        confirmPassword: function(code, pwd, cbs){
                            cbs.onSuccess("<CognitoUser::confirmPassword.onSuccess( {"+code+"} )>")
                            cbs.onFailure("<CognitoUser::confirmPassword.onFailure( {error} )>")
                        }
                    }
                },
                CognitoUserPool: function(dt){
                    return {
                        signUp: function(e, p, a, n, cb){
                            arc.log(1, "<CognitoUserPool::signUp.callback( {user} )>")
                            cb(null, {
                                user: {
                                    email: e,
                                    pwd: p,
                                    attrs: a
                                }
                            })
                            cb("<CognitoUserPool::signUp.callback( {error} )>")
                        },
                        getCurrentUser: function(){
                            return {
                                signOut: function(){},
                                getSession: function(cb){
                                    cb(null, {
                                        isValid: function(){
                                            return true;
                                        },
                                        getIdToken: function(){
                                            return {
                                                getJwtToken: function(){
                                                    return "${hash:id_token}"
                                                }
                                            }
                                        }
                                    })
                                },
                                getUserAttributes: function(cb){
                                    cb(null, "${object:user_attrs}")
                                }
                            }
                        }
                    }
                },
                CognitoUserAttribute: function(dt){
                    return dt
                },
                AuthenticationDetails: function(d){}
            }
        }
    }

    arc.mod_init = function(){
        this.mods.forEach(function(mod){
            if(!mod.hasOwnProperty("ready")){
                arc[mod.name] = new mod.ref(arc)
                mod.ready = true;
            }
        })
    }.bind(arc)

    try{
        module.exports = arc;
    }catch(err){
        this.arc = arc;
    }

}).apply(this);