describe("CognitoSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const cognito = require('../core/auth/cognito');

    const email = "email@server.com";
    const pwd = "hashedpwd";
    const code = "hashcode";

    this.AWSCognito = deps.aws.AWSCognito
    this.AmazonCognitoIdentity = deps.aws.AmazonCognitoIdentity

    arc.exports(cognito)
    arc.init({
        cognito: {
            poolId: "poolthisid",
            domain: "mydomain",
            clientId: "clientd"
        }
    }, this);

    it("Cognito should signin", () => {
        arc.cognito.signin(email, pwd, function(result){
            arc.log(1, result)
            arc.cognito.getAuthToken(function(token, attrs) {
                arc.log(1, "<cognito.getAuthToken>", {
                    token: token,
                    attrs: attrs
                })
            }, function(err){
                arc.log(3, err)
            });
        }, function(err){
            arc.log(3, err);
        });
    });

    it("Cognito should signup", () => {
        arc.cognito.addUserAttribute("email", email)
        arc.cognito.addUserAttribute("password", pwd)
        arc.cognito.addUserAttribute("phone", "+52")
        arc.cognito.signup(
            function(user) {
                arc.log(1, user)
            }, function(err) {
                arc.log(3, err)
            });
    });

    it("Cognito should recover password", () => {
        arc.cognito.forgotPassword(email,
            function(data) {
                arc.log(1, data)
            }, function(err) {
                arc.log(3, err)
            });

        arc.cognito.confirmPwd(email, code, pwd,
            function(data) {
                arc.log(1, data)
            }, function(err){
                arc.log(3, err)
            });
    });

    it("Cognito should sign out", () => {
        arc.cognito.signOut()
    });
});
