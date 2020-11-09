describe("ManagerSpec", () => {
    const arc = require('../core/boot');
    const modelview = require('../core/models/model-view');
    const manager = require('../core/manager');

    arc.exports(modelview)
    arc.exports(manager)
    arc.mod_init();

    it("Manager should register the model", () => {
        arc.manager.register(
            arc.modelView("view", function(log){
                this.customObservable = arc.deps.ko.observable()
                this.customAttribute = "My custom attribute"
            }));

        arc.models.view.on = function onEvent(event, data){}

        arc.manager.bootstrap()

        arc.log(1, "<model-view::identity>", arc.models.view.identity)

        expect(arc.models.view.identity).toEqual("view")
    });
});
