describe("StorageSpec", () => {
    var arc = require('../core/boot');
    const deps = require('../data/deps');
    var storage = require('../core/storage');

    arc.exports(storage)
    arc.init({}, deps);

    it("Data should be added into storage", () => {
        arc.memstg.add("data", "mock")
        expect(arc.memstg.get("data")).toEqual("mock")
    });
});
