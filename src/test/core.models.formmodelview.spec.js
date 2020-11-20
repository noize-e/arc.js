describe("FormModelViewSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const modelview = require('../core/models/model-view');
    const formmodelview = require('../core/models/form-model-view');

    this.ko = deps.ko
    this.document = deps.document

    arc.exports(modelview)
    arc.exports(formmodelview)
    arc.init({}, deps);

    it("New FormModelView instance should be created", () => {

        let signin = arc.formModel("signin", ["email", "password"], function(log, loader){
            this.exinput('email');

            this.onSubmit = function onSubmit(values) {
                loader.show()
                this.alert("all cool")
            }

            this.send = function() {
                email = "e.com";
                if (!this._u.isEmail(email)){
                    this.inputerr('email', 'Invalid email')
                }
            }
        });

        // pre-binding
        signin.on = function onEvent(event, data){}
        arc.boot()

        expect(signin.uid).toEqual("signin")
    });
});
