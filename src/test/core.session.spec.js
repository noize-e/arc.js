describe("SessionSpec", () => {
    let arc = require('../core/boot');
    const deps = require('../data/deps');
    let storage = require('../core/storage');
    let session = require('../core/session');

    arc.exports(storage)
    arc.exports(session)
    arc.init({}, deps);

    it("New session should be created", () => {
        arc.session.create()
        arc.session.add("data", "mock")
        expect(arc.session.get("data")).toEqual("mock")
    });
});
