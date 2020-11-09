/*
 * CHANGELOG - 8/Nov/2020
 *
 * - Modified: Manager class now is part of arc's global context: 'arc.manager::Manager'.
 * - Added: New setting into arc's configuration object: 'arc.conf.manager.initialize'.
 *    * initialize setting enables/disables Manager's instance creation on script file load.
 *
 */
(function core_manager() {
    'use strict';

    var modexport = {
        name: "manager"
    }

    modexport.ref = (function() {
        'use strict';

        var models = [];
        var directory = {};

        var Manager = function Manager() {
            this.bootstrapped = false;
        };

        Manager.prototype = {
            register: function register(model) {
                models.push(model);
                directory[model.identity] = model;

                if (this.bootstrapped) {
                    model.init();
                }
            },
            bootstrap: function bootstrap() {
                for (var i = 0; i < models.length; i++) {
                    models[i].init();
                }

                this.bootstrapped = true;
            },
            find: function find(model) {
                try {
                    return directory[model];
                } catch (err) {
                    return null;
                }
            }
        };

        return Manager;
    }());



    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }


}).apply(this);