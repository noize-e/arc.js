describe("StorageSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const storage = require('../core/storage');

    this.localStorage = deps.localStorage;

    arc.exports(storage)
    arc.init({}, this);

    it("Data should be added into storage", () => {
        arc.memstg.add("data", "mock")
        expect(arc.memstg.get("data")).toEqual("mock")
    });
});
