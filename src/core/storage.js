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
            name: "memstg"
        },
        item,
        lstg,
        data = {},
        log,
        message = "Sorry, it looks like your browser storage has been corrupted.";
        message += " Please clear your local storage by deleting cache and cookies.";

    /**
     * Storage Prototype
     */
    modexport.ref = (function(){
        'use strict'

        var Storage = function Storage(arc) {
            log = arc.log;
            try {
                lstg = localStorage;
            } catch (err) {
                log(2, "<Storage::construct> Data will not persist in memory");
                lstg = {
                    getItem: function getItem(name) {
                        return data[name];
                    },
                    setItem: function setItem(name, item) {
                        data[name] = item;
                        return item;
                    }
                };
            }
        };

        Storage.prototype = {

            get: function get(name) {
                try {
                    item = JSON.parse(lstg.getItem(name));
                    return item;
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        log(2, message);
                    }
                }

                return null;
            },

            add: function add(name, item) {
                try {
                    lstg.setItem(name, JSON.stringify(item));

                    return item;
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        log(2, message);
                    }
                }

                return null;
            },

            remove: function remove(name) {
                try {
                    lstg.removeItem(name);
                } catch (e) {
                    if (e.name === "NS_ERROR_FILE_CORRUPTED") {
                        log(2, message);
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