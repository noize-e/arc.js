"use strict";

/**
 * @module Session
 *
 * Ready: utils calls from namespacing
 */
(function(arc) {
    'use strict';

    var Session = function(utils) {
        'use strict';

        var data, storage;
        Session.ref = "session";
        Session.public = true;

        function Session(arc, conf) {
            if (!(this instanceof Session)) {
                return new Session(arc, conf);
            }

            storage = arc.get_mod("Storage")(arc);
            Object.defineProperties(this, {
                sid: {
                    value: storage.get('sid', true) || Math.floor(Date.now() / 1000),
                    writable: false,
                    configurable: false,
                    enumerable: false
                },
                data: {
                    configurable: false,
                    enumerable: false,
                    get: function() {
                        var dt = storage.get(this.sid);
                        if (utils.isNull(dt)) return {
                            fresh: true
                        };
                        else dt.fresh = false;
                        return dt;
                    },
                    set: function(dt) {
                        var ssdt = storage.get(this.sid) || {};

                        if (utils.isObj(dt) && utils.owns(dt, 'merge')) {
                            utils.extend(ssdt, dt.raw);
                        } else if (utils.isObj(dt) && utils.owns(dt, ['key', 'value'])) {
                            ssdt[dt.key] = dt.value;
                        } else {
                            ssdt = dt;
                        }

                        return storage.add(this.sid, ssdt);
                    }
                }
            });
            storage.add('sid', this.sid, true);
        }

        Session.prototype = {
            create: function create(data) {
                if (!utils.isObj(data)) {
                    throw new Error("Session data must be object type.");
                }

                if (this.data.fresh) {
                    var date = new Date();
                    data.created_at = date.toUTCString();
                    this.data = data;
                    return true;
                }

                return false;
            },
            merge: function merge(ndata) {
                if (!this.create(ndata)) {
                    this.data = {
                        raw: ndata,
                        merge: true
                    };
                }
            },
            add: function add(prop, value) {
                this.data = {
                    key: prop,
                    value: value
                };
            },
            get: function get(prop) {
                return this.data[prop];
            },
            remove: function remove(prop) {
                data = this.data;
                delete data[prop];
                this.merge(data);
            },
            getData: function getData() {
                return this.data;
            },
            getIdToken: function getIdToken() {
                return this.get('id_token');
            },
            getAccessToken: function getAccessToken() {
                return this.get('access_token');
            },
            checkAccess: function checkAccess() {
                return utils.isSet(this.data['id_token']);
            },
            destroy: function destroy() {
                storage.remove(this.sid);
                storage.remove('sid');
            }
        };
        return Session;
    }(arc.u);

    arc.add_mod(Session);
})(this.arc);