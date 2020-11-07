describe("UtilsSpec", () => {
    var arc = require('../core/boot');
    var utils = require('../core/utils');

    arc.mods.push(utils)
    arc.initmods(this);

    it("isNull validation should be true", () => {
        var isnull = this.isNull(null);
        expect(isnull).toEqual(true);
    });

    it("isSet validation should be false", () => {
        let isset = false;
        if(this.isSet()){
            isset = true
        }
        expect(isset).toEqual(false);
    });

    it("isArray validation should be true", () => {
        let isarray = this.isArray([])
        expect(isarray).toEqual(true);
    });

    it("goTo", () => {
        let _url = this.goTo("d", true);
        expect(_url).toEqual("/d");
    });

    xit("getUrlVars", () => {
        //helpers.goTo("d", true);
    });

    xit("getUrlParam", () => {
        //helpers.getUrlParam();
    });
});
