describe("protos", () => {
    const arc = require('../../pre/proto/arc');
    const deps = require('../data/deps');

    this.localStorage = deps.localStorage;
    this.AWSCognito = deps.aws.AWSCognito;
    this.AmazonCognitoIdentity = deps.aws.AmazonCognitoIdentity;
    this.document = deps.document;
    this.ko = deps.ko;

    const email = "email@server.com";
    const pwd = "hashedpwd";
    const code = "hashcode";

    arc.init({
        cognito: {
            poolId: "poolthisid",
            domain: "mydomain",
            clientId: "clientd"
        }
    }, this);

    // @ModelView
    it("Instance should be created", () => {
        let home = arc.modelView("home", function(log){
            // Custom observable
            this.obs("custom", null);
            // Custom attribute
            this.customAttribute = "My custom attribute"
        });

        // pre-binding
        home.on = function onEvent(event, data){}

        arc.boot();

        expect(home.uid).toEqual("home")
    });


    //  @FormModelView
    it("FormModelView instance should be created", () => {
        let signin = arc.formView("signin", ["email", "password"],
            function(log, loader){
                log("I'm a pretty boy")
            });

        // pre-binding
        signin.on = function onEvent(event, data){}

        expect(signin.uid).toEqual("signin")
    });


    // @Sestg
    it("session should be created", () => {
        arc.session.create({})
        expect(arc.session).toBeDefined()
    });

    it("data should be added to session", () => {
        arc.session.add("data", "mock")
        expect(arc.session.get("data")).toEqual("mock")
    });


    // @Cognito
    it("Cognito should signin", () => {
        arc.cognito.signin(email, pwd, function(result){
            arc.cognito.getAuthToken(function(token, attrs) {
                arc.c.log("<cognito.getAuthToken>", {
                    token: token,
                    attrs: attrs
                })
            }, function(err){
                arc.c.err(err)
            });
        }, function(err){
            arc.c.err(err);
        });
    });

    it("Cognito should signup", () => {
        arc.cognito.addUserAttribute("email", email)
        arc.cognito.addUserAttribute("password", pwd)
        arc.cognito.addUserAttribute("phone", "+52")
        arc.cognito.signup(
            function(user) {
                arc.c.log("sign-up", user)
            }, function(err) {
                arc.c.err(err)
            });
    });

    it("Cognito should recover password", () => {
        arc.cognito.forgotPassword(email,
            function(data) {
                arc.c.log(data)
            }, function(err) {
                arc.c.err(err)
            });

        arc.cognito.confirmPwd(email, code, pwd,
            function(data) {
                arc.c.log(data)
            }, function(err){
                arc.c.err(err)
            });
    });

    it("Cognito should sign out", () => {
        arc.cognito.signOut()
    });
});
