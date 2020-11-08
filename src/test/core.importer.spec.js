describe("ImporterSpec", () => {
    var arc = require('../core/boot');
    var importer = require('../core/importer');

    it("isNull validation should be true", () => {
        arc.mods.push(importer)
        arc.mod_init();
    });
});
