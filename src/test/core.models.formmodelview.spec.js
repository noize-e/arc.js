describe("FormModelViewSpec", () => {
    const arc = require('../core/boot');
    const modelview = require('../core/models/model-view');
    const formmodelview = require('../core/models/form-model-view');

    arc.exports(modelview)
    arc.exports(formmodelview)
    arc.mod_init();

    it("New FormModelView instance should be created", () => {

        let modf = arc.formModelView("sign_in", ["email", "password"],
            function(log){
                this.onSubmit = function onSubmit(values, loader) {
                    arc.log(1, "<FormModelView::onSubmit>")
                }
            });

        // pre-binding
        modf.on = function onEvent(event, data){}
        modf.init();

        expect(modf.identity).toEqual("sign_in")
    });
});
