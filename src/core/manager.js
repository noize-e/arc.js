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

    var _arc,
        modexport = {
            name: "mng"
        };

    modexport.ref = (function() {
        'use strict';

        var models = [],
            directory = {},
            manifest = {},
            ready = false;

        function Manager(arc){
            _arc = arc
        };

        Manager.prototype = {
            newmdl: function newmdl(n, c) {
                var mdl = _arc.modelView(n, c)
                _arc.mdl[n] = mdl;

                if (ready) {
                    mdl.init();
                }
            },
            boot: function bootstrap() {
                Object.keys(_arc.mdl).forEach(function(k) {
                    _arc.mdl[k].init()
                });
                ready = true;
            },
            find: function find(n) {
                try {
                    return _arc.mdl[n];
                } catch (err) {
                    return null;
                }
            }
        };

        return Manager;
    }());



    try{
        module.exports = modexport;
    }catch(err){
        this.arc.exports(modexport);
    }


}).apply(this);