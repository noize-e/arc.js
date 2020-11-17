describe("FormModelViewSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const modelview = require('../core/models/model-view');
    const formmodelview = require('../core/models/form-model-view');

    arc.exports(modelview)
    arc.exports(formmodelview)
    arc.init({}, deps);

    it("New FormModelView instance should be created", () => {

        let fmv = arc.new_fmv("sign_in", ["email", "password"],
            function(log){
                this.onSubmit = function onSubmit(values, loader) {
                    arc.log(1, "<FormModelView::onSubmit>")
                }
            });

        // pre-binding
        fmv.on = function onEvent(event, data){}

        fmv.mngr.boot()

        expect(fmv.uid).toEqual("sign_in")
    });
});
