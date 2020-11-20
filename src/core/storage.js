/*
 * CHANGELOG - 8/Nov/2020
 *
 * - Modified: Storage class now is part of arc's global context: 'arc.storage.Storage'.
 * - Added: New setting into arc's configuration object: 'arc.conf.storage.initialize'.
 *    * initialize setting enables/disables Storage's instance creation on script file load.
 *
 */
(function core_storage(arc){

    var modexport = {
            name: "memstg",
            peers: ["localStorage"]
        },
        item,
        storage,
        data = {},
        logger,
        message = "Sorry, it looks like your browser storage has been corrupted.";
        message += " Please clear your local storage by deleting cache and cookies.";

    /**
     * Storage Prototype
     */
    modexport.ref = (function(){
        'use strict'

        var Storage = function Storage(arc) {
            logger = arc.log;
            storage = arc.localStorage;
        };

        Storage.prototype = {

            get: function get(name) {
                try {
                    return JSON.parse(storage.getItem(name));
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        logger(2, message);
                    }
                }

                return null;
            },

            add: function add(name, item) {
                try {
                    storage.setItem(name, JSON.stringify(item));
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        logger(2, message);
                    }
                }
            },

            remove: function remove(name) {
                try {
                    storage.removeItem(name);
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        logger(2, message);
                    }
                }
            }
        };

        return Storage;
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }


}).apply(this);