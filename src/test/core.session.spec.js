describe("SessionSpec", () => {
    const arc = require('../core/boot');
    const deps = require('../data/deps');
    const storage = require('../core/storage');
    const session = require('../core/session');

    this.localStorage = deps.localStorage;

    arc.exports(storage)
    arc.exports(session)
    arc.init({
        session: {
            ctx_glob: true
        }
    }, this);

    it("session should be created", () => {
        this.session.create({})
        expect(this.session).toBeDefined()
    });

    it("data should be added to session", () => {
        this.session.add("data", "mock")
        expect(this.session.get("data")).toEqual("mock")
    });
});
