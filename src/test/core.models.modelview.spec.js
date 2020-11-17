describe("ModelViewSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const modelview = require('../core/models/model-view');

    arc.exports(modelview)
    arc.init({}, deps);

    it("New ModelView instance should be created", () => {
        let mv = arc.new_mv("id", function(log){
            this.customObservable = arc.deps.ko.observable()
            this.customAttribute = "My custom attribute"
        });

        // pre-binding
        mv.on = function onEvent(event, data){}

        mv.mngr.boot()

        expect(mv.uid).toEqual("id")
    });
});
