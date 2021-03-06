// @module Cognito
;(function(arc) {
    'use strict';

    var Cognito = (function(arc, utils) {
        'use strict';

        var _userAttributes = [],
            _userEmail,
            _userPassword,
            _userPool,
            _authToken,
            _cognitoUser;

        Cognito.ref = "cognito";
        Cognito.public = true
        Cognito.peers = ["AWSCognito", "AmazonCognitoIdentity"]

        function Cognito(arc, conf) {
            if((utils.isNull(conf.poolId) || conf.poolId == "") ||
                (utils.isNull(conf.clientId) || conf.clientId == "")){
                arc.warn("Cognito will not be available")
                return null;
            }

            if (!utils.instanceof(this, Cognito)) {
                return new Cognito(arc, conf);
            }

            arc.d.AWSCognito.config.region = conf.region;

            this.sdk = arc.d.AmazonCognitoIdentity;

            this.evt = {
                not_auth: 'NotAuthorizedException',
                auth_excep: 'UserNotConfirmedException',
                usr_exist: "UsernameExistsException",
                pwd_mismatch: "PasswordMismatchError"
            }

            _userPool = new this.sdk.CognitoUserPool({
                UserPoolId: conf.poolId,
                ClientId: conf.clientId
            });
        }

        Cognito.prototype = {
            _createUser: function(email) {
                return new this.sdk.CognitoUser({
                    Username: email,
                    Pool: _userPool,
                });
            },

            on: function(e, d) {},

            signin: function(email, password, onSuccess, onFailure) {
                _cognitoUser = this._createUser(email);
                _cognitoUser.authenticateUser(
                    new this.sdk.AuthenticationDetails({
                        Username: email,
                        Password: password,
                    }), {
                        onSuccess: onSuccess,
                        onFailure: function(err){
                            arc.c.err(err)
                            onFailure(err)
                        }
                    }
                );
            },

            resendCode: function(callback) {
                _cognitoUser.resendConfirmationCode(function(err, result) {
                    if (err) {
                        arc.c.err(err)
                        return callback('error', err.message || JSON.stringify(err));
                    }
                    callback('success', result);
                });
            },

            addUserAttribute: function(name, value) {
                if (name === 'email') {
                    _userEmail = value;
                } else if (name === 'password') {
                    _userPassword = value;
                } else {
                    _userAttributes.push(
                        new this.sdk.CognitoUserAttribute({
                            Name: name,
                            Value: value,
                        }),
                    );
                }
            },

            signup: function(onSuccess, onFailure) {
                _userPool.signUp(_userEmail, _userPassword, _userAttributes, null,
                    function(error, result) {
                        if (error) {
                            arc.c.err(error)
                            onFailure(error);
                        } else {
                            onSuccess(result.user);
                        }
                    },
                );
            },

            confirm: function(email, code, onSuccess, onFailure) {
                this._createUser(email).confirmRegistration(code, true,
                    function(err, result) {
                        if (err) {
                            arc.c.err(err)
                            onFailure(err);
                        } else {
                            onSuccess(result);
                        }
                    },
                );
            },

            signOut: function() {
                try {
                    _userPool.getCurrentUser().signOut();
                    arc.session.destroy();
                } catch(e) {
                    arc.c.err(e)
                }
            },

            getAuthToken: function(onToken, onInvalidSession) {
                this.authToken = new Promise(function(resolve, reject) {
                    _cognitoUser = _userPool.getCurrentUser();

                    if (_cognitoUser) {
                        _cognitoUser.getSession(function(err, session) {
                            if (err) {
                                reject(err);
                            } else if (!session.isValid()) {
                                reject(null);
                            } else {
                                _cognitoUser.getUserAttributes(function(err, attributes) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        _authToken = session.getIdToken().getJwtToken();

                                        var data = { 'id_token': _authToken };
                                        for (var i = 0; i < attributes.length; i++) {
                                            data[attributes[i].Name] = attributes[i].Value;
                                        }

                                        arc.session.merge(data);
                                        resolve(attributes);
                                    }
                                });
                            }
                        });
                    } else {
                        reject(null);
                    }
                });

                this.authToken.then(function(attrs) {
                    if (_authToken) {
                        onToken(_authToken, attrs);
                    } else {
                        onInvalidSession('EmptyToken');
                    }
                }).catch(onInvalidSession);
            },

            getUser: function() {
                try {
                    return _userPool.getCurrentUser();
                } catch (error) {
                    return 'anonim';
                }
            },

            forgotPassword: function(email, onSuccess, onFailure) {
                this._createUser(email).forgotPassword({
                    'onSuccess': onSuccess,
                    'onFailure': onFailure,
                });
            },

            confirmPwd: function(email, code, pwd, onSuccess, onFailure) {
                this._createUser(email).confirmPassword(code, pwd, {
                    'onSuccess': onSuccess,
                    'onFailure': onFailure,
                });
            },
        }

        return Cognito;
    }(arc, arc.u));

    arc.add_mod(Cognito)

}(this.arc));