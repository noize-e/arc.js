(function() {
    module.exports = {
        document: {
            getElementById: function getElementById(identity) {
                // console.log("[mockup] getElementById", identity)
                return {
                    identity: identity,
                    className: "mockup-classname"
                };
            }
        },
        ko: {
            observable: function observable(args) {
                // console.log("[mockup] observable", arguments);
                return this.observable;
            },
            applyBindings: function applyBindings(args) {
                // console.log("[mockup] applyBindings", arguments);
                return this.applyBindings;
            }
        },
        aws: {
            cognito: {
                region: "",
                sdk: {
                    config: {
                        region: "us-west-1"
                    }
                },
                pool_id: "",
                pool_client_id: "",
                identity: {
                    CognitoUser: function CognitoUser(d) {
                        return {
                            authenticateUser: function authenticateUser(dt, cbs) {
                                cbs.onSuccess(
                                    "<CognitoUser::authenticateUser.onSuccess( {data} )>"
                                );
                                cbs.onFailure(
                                    "<CognitoUser::authenticateUser.onFailure( {error} )>"
                                );
                            },
                            confirmRegistration: function confirmRegistration(cb) {},
                            resendConfirmationCode: function resendConfirmationCode(cb) {},
                            forgotPassword: function forgotPassword(cbs) {
                                cbs.onSuccess(
                                    "<CognitoUser::forgotPassword.onSuccess( {data} )"
                                );
                                cbs.onFailure(
                                    "<CognitoUser::forgotPassword.onFailure( {error} )>"
                                );
                            },
                            confirmPassword: function confirmPassword(code, pwd, cbs) {
                                cbs.onSuccess(
                                    "<CognitoUser::confirmPassword.onSuccess( {" + code + "} )>"
                                );
                                cbs.onFailure(
                                    "<CognitoUser::confirmPassword.onFailure( {error} )>"
                                );
                            }
                        };
                    },
                    CognitoUserPool: function CognitoUserPool(dt) {
                        return {
                            signUp: function signUp(e, p, a, n, cb) {
                                // console.log(1, "<CognitoUserPool::signUp.callback( {user} )>");
                                cb(null, {
                                    user: {
                                        email: e,
                                        pwd: p,
                                        attrs: a
                                    }
                                });
                                cb("<CognitoUserPool::signUp.callback( {error} )>");
                            },
                            getCurrentUser: function getCurrentUser() {
                                return {
                                    signOut: function signOut() {},
                                    getSession: function getSession(cb) {
                                        cb(null, {
                                            isValid: function isValid() {
                                                return true;
                                            },
                                            getIdToken: function getIdToken() {
                                                return {
                                                    getJwtToken: function getJwtToken() {
                                                        return "${hash:id_token}";
                                                    }
                                                };
                                            }
                                        });
                                    },
                                    getUserAttributes: function getUserAttributes(cb) {
                                        cb(null, "${object:user_attrs}");
                                    }
                                };
                            }
                        };
                    },
                    CognitoUserAttribute: function CognitoUserAttribute(dt) {
                        return dt;
                    },
                    AuthenticationDetails: function AuthenticationDetails(d) {}
                }
            }
        }
    };
}).apply(this);