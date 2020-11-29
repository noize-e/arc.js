// @module [public] Sestg
(function(arc) {
    'use strict';

    var Systg = (function(){
        'use strict'

        var item,
            data = {},
            message = "Sorry, it looks like your browser storage has been corrupted.";
            message += " Please clear your local storage by deleting cache and cookies.";


        // @static
        Systg.ref = "systg"
        Systg.public = true
        Systg.peers = ["localStorage"]


        // @constructor
        function Systg(arc, conf) {
            // enforces new
            if (!(this instanceof Systg)) {
                return new Systg(arc, conf);
            }
        };


        // @prototype [public]
        Systg.prototype = {

            get: function get(name) {
                try {
                    return JSON.parse(arc.localStorage.getItem(name));
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        console.log(message);
                    }
                }

                return null;
            },

            add: function add(name, item) {
                try {
                    arc.localStorage.setItem(name, JSON.stringify(item));
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        console.log(message);
                    }
                }
            },

            remove: function remove(name) {
                try {
                    arc.localStorage.removeItem(name);
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        console.log(message);
                    }
                }
            }
        };

        return Systg;
    }());

    arc.add_mod(Systg)

}(this.arc));