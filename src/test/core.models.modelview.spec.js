describe("ModelViewSpec", () => {
    var arc = require('../core/boot');
    var modelview = require('../core/models/model-view');

    it("New ModelView instance should be created", () => {
        arc.mods.push(modelview)
        arc.mod_init();

        let vmod = arc.modelView("id", function(log){
            this.customObservable = arc.deps.ko.observable()
            this.customAttribute = "My custom attribute"
        });

        // pre-binding
        vmod.on = function onEvent(event, data){}
        vmod.init();

        expect(vmod.identity).toEqual("id")
    });
});
