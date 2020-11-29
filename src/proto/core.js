// @module [private] Core
;(function(arc){
    'use strict';


    var Core = (function(arc) {
        'use strict';

        // @private vars
        var rawModules = {},
            modules = {};

        // @constructor
        function Core() {
            // enforces new
            if (!(this instanceof Core)) {
                return new Core();
            }
        };

        // @private
        function checkPeers(module, app) {
            try {
                if (module.hasOwnProperty("peers")) {
                    module.peers.forEach(function(peer) {
                        if (!app.hasOwnProperty(peer)) {
                            throw new Error("Missing Dependency");
                        }

                        if(!module.hasOwnProperty("carnivorePeers")){
                            this[peer] = app[peer];
                        }
                    }, this);
                }

                return true;
            } catch (err) {
                return false;
            }
        }

        Core.prototype = arc

        // @public
        Core.prototype.add_mod = function(module) {
            arc.log("add module: ", module.ref);
            rawModules[module.ref] = module;
        }

         // @public
        Core.prototype.get_mod = function(modname) {
            if(modules.hasOwnProperty(modname)){
                return modules[modname];
            }
            throw new Error("InvalidModule: ", modname);
        }

        // @public
        Core.prototype.init = function(_conf, app) {
            this.load_conf(_conf);

            Object.keys(rawModules).forEach(function(k) {
                var mod = rawModules[k],
                    conf = this.get_conf(k);

                if (checkPeers.call(this, mod, app)) {
                    if(this.owns(mod, 'public')){
                        this[mod.ref] = mod(arc, conf);
                        if(this.owns(mod, 'namespace')){
                            this[mod.namespace] = this[mod.ref];
                        }
                    }
                    modules[mod.ref] = mod;
                    arc.log("loaded module: ", mod.ref);
                }
            }, this);
        }

        return Core;
    }(arc));

    arc = Core();

}(this.arc));