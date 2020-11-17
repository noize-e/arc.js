describe("ImporterSpec", () => {
    var arc = require('../core/boot');
    const deps = require('../data/deps');
    var importer = require('../core/importer');

    it("isNull validation should be true", () => {
        arc.exports(importer)
        arc.init({}, deps);
    });
});
