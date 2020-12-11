/**
 * Module: Storage(systg)
 * Namespacing Status:
 *  arc.d: ok
 *  arc.u: ok
 */
(function(arc) {
    'use strict';

    // message = "Sorry, it looks like your browser storage has been corrupted.";
    // message += " Please clear your local storage by deleting cache and cookies.";

    var Storage = (function(arc, utils){
        'use strict'

        var item, storage, data = {};

        // @static
        Storage.ref = "systg";
        Storage.public = true;
        Storage.peers = ["localStorage"];


        // @constructor
        function Storage(arc, conf) {
            // enforces new
            if (!(this instanceof Storage)) {
                return new Storage(arc, conf);
            }

            storage = arc.d.localStorage
        };


        // @prototype [public]
        Storage.prototype = {

            get: function get(name) {
                try {
                    var hash = utils.hashCode(name),
                        item64 = utils.b64d(storage.getItem(hash));

                    arc.debug("storage::get", {
                        name: hash,
                        item: item64
                    });

                    return JSON.parse(item64);
                } catch (e) {
                    arc.err(e, {
                        action: 'get',
                        name: name
                    });
                }

                return null;
            },

            add: function add(name, item) {
                try {
                    var hash = utils.hashCode(name),
                        item64 = utils.b64e(JSON.stringify(item));

                    arc.debug("storage::add", {
                        name: hash,
                        item: item64
                    });

                    storage.setItem(hash, item64);
                } catch (e) {
                    arc.err(e, {
                        action: 'add',
                        name: name,
                        item: item
                    });
                }
            },

            remove: function remove(name) {
                try {
                    var hash = utils.hashCode(name);
                    storage.removeItem(hash);
                } catch (e) {
                    arc.err(e, {
                        action: 'remove',
                        name: name
                    });
                }
            }
        };

        return Storage;

    }(arc, arc.u));

    arc.add_mod(Storage)

}(this.arc));