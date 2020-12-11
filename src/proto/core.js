/**
 * CoreModule: Core
 * Namespacing Status:
 *  arc.u: unknown
 */
;(function(arc){
    'use strict';


    var Core = (function(arc, utils, stdout) {
        'use strict';

        /**
         * Modules peers(dependencies) namespacing
         */
        arc.d = {}
        arc.e = {}

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

                        /**
                         * If this attribute is set, the peers loading
                         * into arc's context will be skipped.
                         */
                        if(!module.hasOwnProperty("carnivorePeers")){
                            // Add peer into arc.d context
                            this.d[peer] = app[peer];
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
        Core.prototype.add_ext = function(namespace, extension) {
            stdout.debug("add extension: ", [namespace, extension]);
            this.e[namespace] = extension;
        }

        // @public
        Core.prototype.add_mod = function(module) {
            stdout.debug("add module: ", module.ref);
            rawModules[module.ref] = module;
        }

         // @public
        Core.prototype.get_mod = function(modname) {
            if(modules.hasOwnProperty(modname)){
                return modules[modname];
            }
            throw new Error("InvalidModule: ", modname);
        }

        Core.prototype.load_mod = function(mod, app) {
            var conf = this.get_conf(mod.ref);

            if (checkPeers.call(this, mod, app)) {
                /**
                 * Load modules into arc's context
                 */
                if(utils.owns(mod, 'public')){
                    this[mod.ref] = mod(arc, conf);
                    if(utils.owns(mod, 'namespace')){
                        this[mod.namespace] = this[mod.ref];
                    }
                }

                modules[mod.ref] = mod;

                stdout.debug("loaded module: ", mod.ref);
            }
        }

        // @public
        Core.prototype.init = function(_conf, app) {
            this.load_conf(_conf);

            Object.keys(rawModules).forEach(function(k) {
                var mod = rawModules[k];
                this.load_mod(mod, app);
            }, this);
        }

        return Core;

    }(arc, arc.u, arc.c));

    arc = Core();

}(this.arc));