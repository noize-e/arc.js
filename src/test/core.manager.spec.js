describe("ManagerSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const modelview = require('../core/models/model-view');
    const manager = require('../core/manager');

    arc.exports(modelview)
    arc.exports(manager)
    arc.init({}, deps);

    it("Manager should register the model", () => {
        arc.mng.newmdl("view", function(log){
            this.customObservable = arc.deps.ko.observable()
            this.customAttribute = "My custom attribute"
        });

        arc.mdl.view.on = function onEvent(event, data){}

        arc.mng.boot()

        arc.log(1, "<model-view::identity>", arc.models.view.identity)

        expect(arc.models.view.identity).toEqual("view")
    });
});
