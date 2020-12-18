;(function(arc){
    'use strict';

    /**
     * Modules peers(dependencies) namespacing
     */
    arc.namespace("e")
    arc.namespace("d")

    var Core = (function(arc, utils, stdout) {
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
                        if (!app.hasOwnProperty(peer))
                            throw new Error("Missing Dependency");

                        // Add peer into arc.d context
                        Object.defineProperty(this.d, peer, {
                            value: app[peer],
                            writable: false,
                            configurable: false,
                            enumerable: false
                        });
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
            rawModules[module.ref] = module;
        }

         // @public
        Core.prototype.get_mod = function(modname) {
            if(!modules.hasOwnProperty(modname)){
                return null
            }
            return modules[modname];
        }

        Core.prototype.load_mod = function(mod, app) {
            var conf = this.conf(mod.ref);

            if (checkPeers.call(this, mod, app)) {
                /**
                 * Load modules into arc's context
                 */
                if(utils.owns(mod, 'public')){
                    Object.defineProperty(this, mod.ref, {
                        value: mod(arc, conf),
                        writable: false,
                        configurable: false,
                        enumerable: false
                    })

                    if(utils.owns(mod, 'namespace')){
                        Object.defineProperty(this, mod.namespace, {
                            value: this[mod.ref],
                            writable: false,
                            configurable: false,
                            enumerable: false
                        });
                    }
                }

                modules[mod.ref] = mod;

                stdout.debug("loaded module: ", mod.ref);
            }
        }

        // @public
        Core.prototype.init = function(_conf, app) {
            this.conf = _conf;

            Object.keys(rawModules).forEach(function(k) {
                this.load_mod(rawModules[k], app);
            }, this);
        }

        return Core;

    }(arc, arc.u, arc.c));

    arc = Core();

}(this.arc));