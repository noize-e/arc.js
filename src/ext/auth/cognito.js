(function arc_ext_auth_cognito(global, $) {
    var userAttributes = [],
        userPool,
        userEmail,
        userPassword,
        instance,
        authToken,
        prefix = "[cognito] > ";

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    global.CognitoAuth = global.CognitoAuth || {};
    global.CognitoAuth.on = function(e, d) {}

    global.CognitoAuth.init = function init() {
        AWSCognito.config.region = global.cognitoConfig.region;

        userPool = new AmazonCognitoIdentity.CognitoUserPool({
            UserPoolId: global.cognitoConfig.poolId,
            ClientId: global.cognitoConfig.poolClientId
        });
    }

    global.CognitoAuth.signin = function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });
        CognitoAuth.cognitoUser = createCognitoUser(email);
        CognitoAuth.cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    global.CognitoAuth.resendCode = function resendCode(callback) {
        CognitoAuth.cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                callback("error", err.message || JSON.stringify(err));
                return
            }
            callback('success', result);
        });
    }

    global.CognitoAuth.addUserAttribute = function addUserAttribute(name, value) {
        if (name === "email") {
            userEmail = value;
        } else if (name === "password") {
            userPassword = value;
        } else {
            userAttributes.push(
                new AmazonCognitoIdentity.CognitoUserAttribute({
                    Name: name,
                    Value: value
                })
            );
        }
    };

    global.CognitoAuth.signUp = function signUp(onSuccess, onFailure) {
        userPool.signUp(userEmail, userPassword, userAttributes, null,
            function signUpCallback(error, result) {
                if (error) {
                    onFailure(error);
                } else {
                    onSuccess(result.user);
                }
            }
        );
    }

    global.CognitoAuth.confirm = function confirm(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true,
            function confirmCallback(err, result) {
                if (err) {
                    onFailure(err);
                } else {
                    onSuccess(result);
                }
            }
        );
    }

    global.CognitoAuth.signOut = function signOut() {
        try {
            userPool.getCurrentUser().signOut();
            global.Session.destroy();
        } catch (e) {
            console.log(e);
        }
    }

    global.CognitoAuth.getAuthToken = function getAuthToken(onToken, onInvalidSession) {
        global.CognitoAuth.authToken = new Promise(function fecthToken(resolve, reject) {
            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser) {
                cognitoUser.getSession(function sessionCallback(err, session) {
                    if (err) {
                        reject(err);
                    } else if (!session.isValid()) {
                        reject(null);
                    } else {
                        cognitoUser.getUserAttributes(function(err, attributes) {
                            if (err) {
                                reject(err)
                            } else {
                                authToken = session.getIdToken().getJwtToken();

                                var data = { "id_token": authToken }
                                for (var i = 0; i < attributes.length; i++) {
                                    data[attributes[i].Name] = attributes[i].Value
                                }

                                global.Session.create(data);
                                resolve(attributes);
                            }
                        });
                    }
                });
            } else {
                reject(null);
            }
        });

        global.CognitoAuth.authToken.then(function setAuthToken(attrs) {
            if (authToken) {
                onToken(authToken, attrs);
            } else {
                onInvalidSession("Empty_Token");
            }
        }).catch(onInvalidSession);
    }

    global.CognitoAuth.getUser = function getUser() {
        try {
            return userPool.getCurrentUser();
        } catch (error) {
            return "anonim";
        }
    }

    global.CognitoAuth.forgotPassword = function forgotPassword(email, onSuccess, onFailure) {
        createCognitoUser(email).forgotPassword({
            "onSuccess": onSuccess,
            "onFailure": onFailure
        });
    }

    global.CognitoAuth.confirmPwd = function confirmPwd(email, code, pwd, onSuccess, onFailure) {
        createCognitoUser(email).confirmPassword(code, pwd, {
            "onSuccess": onSuccess,
            "onFailure": onFailure
        });
    }
})(this, jQuery);