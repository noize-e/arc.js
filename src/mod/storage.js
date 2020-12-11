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

    var Storage = (function(arc, utils, stdout){
        'use strict'

        var item, stg, lz, data = {};

        // @static
        Storage.ref = "Storage";
        Storage.peers = ["localStorage"];


        // @constructor
        function Storage(arc) {
            // enforces new
            if (!(this instanceof Storage)) {
                return new Storage(arc);
            }

            stg = arc.d.localStorage;
            // load string compressor
            lz = arc.lz;
        };


        // @prototype [public]
        Storage.prototype = {

            get: function get(name) {
                try {
                    var hash = utils.hashCode(name),
                        item = (stg.getItem(hash));

                    stdout.debug("storage::get", {
                        name: hash,
                        item: item
                    });

                    if(!utils.isNull(item))
                        return JSON.parse(lz.decompressFromUTF16(item));
                } catch (e) {
                    stdout.err("storage::get", e);
                }

                return null;
            },

            add: function add(name, item) {
                try {
                    // On Firefox and IE, localStorage cannot contain invalid UTF16 characters.
                    // So we need the following:
                    var hash = utils.hashCode(name),
                        dataUTF16 = lz.compressToUTF16(JSON.stringify(item));

                    stdout.debug("storage::add", {
                        name: hash,
                        item: dataUTF16
                    });

                    stg.setItem(hash, dataUTF16);
                } catch (e) {
                    stdout.err("storage::add", e);
                }
            },

            remove: function remove(name) {
                try {
                    var hash = utils.hashCode(name);
                    stg.removeItem(hash);
                } catch (e) {
                    stdout.err("storage::remove", e);
                }
            }
        };

        return Storage;

    }(arc, arc.u, arc.c));

    arc.add_mod(Storage)

}(this.arc));