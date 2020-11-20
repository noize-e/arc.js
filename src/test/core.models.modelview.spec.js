describe("ModelViewSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const modelview = require('../core/models/model-view');

    this.ko = deps.ko
    this.document = deps.document

    arc.exports(modelview)
    arc.init({}, this);

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
});
