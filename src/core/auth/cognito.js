(function core_auth_cognito() {

    var instance,
        modexport = {
            name: "cognito"
        };

    modexport.ref = (function() {
        'use strict';

        var _userAttributes = [],
            _userEmail,
            _userPassword,
            _userPool,
            _authToken,
            _cognitoUser,
            _sess,
            _log;

        function Cognito(arc) {
            // enforces new
            if (instance) {
                return instance;
            }

            this.cognito = arc.deps.aws.cognito;

            _sess = arc.session
            _log = arc.log

            this.cognito.sdk.config.region = arc.deps.aws.region;

            _userPool = new this.cognito.identity.CognitoUserPool({
                UserPoolId: this.cognito.pool_id,
                ClientId: this.cognito.pool_client_id
            });

            instance = this;
        }

        Cognito.prototype._createUser = function(email) {
            return new this.cognito.identity.CognitoUser({
                Username: email,
                Pool: _userPool,
            });
        }

        Cognito.prototype.on = function(e, d) {};

        Cognito.prototype.signin = function(email, password, onSuccess, onFailure) {
            _cognitoUser = this._createUser(email);
            _cognitoUser.authenticateUser(
                new this.cognito.identity.AuthenticationDetails({
                    Username: email,
                    Password: password,
                }), {
                    onSuccess: onSuccess,
                    onFailure: onFailure,
                }
            );
        };

        Cognito.prototype.resendCode = function(callback) {
            _cognitoUser.resendConfirmationCode(function(err, result) {
                if (err) {
                    callback('error', err.message || JSON.stringify(err));
                    return;
                }
                callback('success', result);
            });
        };

        Cognito.prototype.addUserAttribute = function(name, value) {
            if (name === 'email') {
                _userEmail = value;
            } else if (name === 'password') {
                _userPassword = value;
            } else {
                _userAttributes.push(
                    new this.cognito.identity.CognitoUserAttribute({
                        Name: name,
                        Value: value,
                    }),
                );
            }
        };

        Cognito.prototype.signup = function(onSuccess, onFailure) {
            _userPool.signUp(_userEmail, _userPassword, _userAttributes, null,
                function(error, result) {
                    if (error) {
                        onFailure(error);
                    } else {
                        onSuccess(result.user);
                    }
                },
            );
        };

        Cognito.prototype.confirm = function(email, code, onSuccess, onFailure) {
            this._createUser(email).confirmRegistration(code, true,
                function(err, result) {
                    if (err) {
                        onFailure(err);
                    } else {
                        onSuccess(result);
                    }
                },
            );
        };

        Cognito.prototype.signOut = function() {
            try {
                _userPool.getCurrentUser().signOut();
                _sess.destroy();
                _log(1, "<Cognito.signOut>")
            } catch(e) {
                _log(2, e)
            }
        };

        Cognito.prototype.getAuthToken = function(onToken, onInvalidSession) {
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

                                    _sess.create(data);
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
                    onInvalidSession('Empty_Token');
                }
            }).catch(onInvalidSession);
        };

        Cognito.prototype.getUser = function() {
            try {
                return _userPool.getCurrentUser();
            } catch (error) {
                return 'anonim';
            }
        };

        Cognito.prototype.forgotPassword = function(email, onSuccess, onFailure) {
            this._createUser(email).forgotPassword({
                'onSuccess': onSuccess,
                'onFailure': onFailure,
            });
        };

        Cognito.prototype.confirmPwd = function(email, code, pwd, onSuccess, onFailure) {
            this._createUser(email).confirmPassword(code, pwd, {
                'onSuccess': onSuccess,
                'onFailure': onFailure,
            });
        };

        return Cognito;
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }

}).apply(this);