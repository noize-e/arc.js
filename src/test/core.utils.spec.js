describe("UtilsSpec", () => {
    var arc = require('../core/boot');
    var utils = require('../core/utils');

    arc.mods.push(utils)
    arc.mod_init.call(this);

    it("isNull validation should be true", () => {
        var isnull = arc.utils.isNull(null);
        expect(isnull).toEqual(true);
    });

    it("isSet validation should be false", () => {
        let isset = arc.utils.isSet();
        expect(isset).toEqual(false);
    });

    it("isArray validation should be true", () => {
        let isarray = arc.utils.isArray([])
        expect(isarray).toEqual(true);
    });

    it("goTo", () => {
        let _url = arc.utils.goTo("d", true);
        expect(_url).toEqual("/d");
    });

    xit("getUrlVars", () => {});

    xit("getUrlParam", () => {});

    xit("serialize", () => {});

    xit("log", () => {});
});
