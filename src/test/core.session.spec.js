describe("SessionSpec", () => {
    let arc = require('../core/boot');
    let storage = require('../core/storage');
    let session = require('../core/session');

    arc.mods.push(storage)
    arc.mods.push(session)
    arc.mod_init();

    it("New session should be created", () => {
        arc.session.create()
        arc.session.add("data", "mock")
        expect(arc.session.get("data")).toEqual("mock")
    });
});
