/**
 *
 *  MODELVIEW STRUCTURE
 *
 *  [model:id] > instance wrapper {
 *      component: {
 *          identity: 'id',
 *          className: 'mockup-classname'
 *      },
 *      identity: 'id',
 *      active: [Function: observable],
 *      loader: [Function: observable],
 *      error: [Function: observable],
 *      log: [Function: log],
 *      on: [Function: on],
 *      showError: [Function: showError],
 *      show: [Function: show],
 *      hide: [Function: hide],
 *      showLoader: [Function: showLoader],
 *      hideLoader: [Function: hideLoader],
 *      init: [Function: init]
 *  }
 *
 * USAGE
 *
 *   let vmod = arc.modelView("id", function(log){
 *       // Extend model object's attributes
 *       this.customObservable = arc.deps.ko.observable()
 *       this.customAttribute = "My custom attribute"
 *   });
 *
 *   // Add event listener before applying bindings
 *   vmod.on = function onEvent(event, data){}
 *
 *   // If ko lib is present, apply dom bindings
 *   vmod.init();
 */
(function core_models_modelview() {
    'use strict'

    var clss = function(arc) {
        'use strict';

        var dom = arc.deps.document;
        var ko = arc.deps.ko;

        /**
         * ModelView static function caller
         * @param {type} identity -- DOM element ID.
         * @param {type} callback -- Model setup callback. Executed
         *                           before wrapper instance creation
         */
        var func = function(identity, callback) {
            'use strict';

            var instance = arc.models[identity];
            var prefix = "[model:" + identity + "] >";
            var log = function log(message, data) {
                console.log(prefix, message, data);
            }

            /**
             * ModelView object for new instances
             * @param {type} identity -- DOM element ID.
             * @param {type} callback -- Model setup callback. Executed
             *                           before wrapper instance creation
             */
            var wrapper = function(identity, callback){
                this.component = dom.getElementById(identity);
                this.identity = identity;
                this.active = ko.observable(false);
                this.loader = ko.observable(false);
                this.error = ko.observable(false);
                this.log = log;

                this.on = function on() {},

                this.showError = function showError(err) {
                    this.error(err);
                    setTimeout(this.error.bind(null, null), 2000);
                };

                this.show = function show() {
                    this.active(true);

                    if (this.component.className.indexOf("active") < 0) {
                        this.component.className += " active";
                    }

                    this.component.className = this.component.className.replace(
                        new RegExp("(^| )hidden($| )", "g"),
                        " "
                    );
                    this.component.className = this.component.className.replace(
                        new RegExp("(^| )off($| )", "g"),
                        " "
                    );
                };

                this.hide = function hide() {
                    // create pattern to find class name
                    this.component.className = this.component.className.replace(
                        new RegExp("(^| )active($| )", "g"),
                        " "
                    );

                    if (this.component.className.indexOf("active") < 0) {
                        this.component.className += " off";
                    }

                    this.active(false);
                };

                this.showLoader = function showLoader() {
                    this.loader(true);
                };

                this.hideLoader = function hideLoader() {
                    this.loader(false);
                };

                this.init = function init() {
                    ko.applyBindings(this, this.component);
                };

                // log("instance", this)

                callback.call(this, log.bind(this));
            };

            // enforces new
            if (!(instance instanceof wrapper)) {
                arc.models[identity] = new wrapper(identity, callback);
                instance = arc.models[identity];
            }

            return instance;
        };

        return func;
    };

    try{
        module.exports = {
            name: "modelView",
            ref: clss
        }
    }catch(err){
        /*
         * Call function clss() to get ModelView's static
         * function caller reference
         */
        arc.modelView = clss();
    }

}.apply(this, [this.arc = this.arc || {models:{}}]));