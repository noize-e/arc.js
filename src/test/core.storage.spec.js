describe("StorageSpec", () => {
    var arc = require('../core/boot');
    var storage = require('../core/storage');

    arc.mods.push(storage)
    arc.mod_init();

    it("Data should be added into storage", () => {
        arc.memstg.add("data", "mock")
        expect(arc.memstg.get("data")).toEqual("mock")
    });
});
