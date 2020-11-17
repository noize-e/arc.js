/**
 *
 *  MODELVIEW STRUCTURE
 *
 *  [model:id] > instance mv {
 *      component: {
 *          uid: 'id',
 *          className: 'mockup-classname'
 *      },
 *      uid: 'id',
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
    'use strict';

    var modexport = {
        name: "new_mv"
    };

    modexport.ref = function(arc) {
        'use strict';

        var rdy = 0;

        var mngr = {
            reg: function(mdl) {
                if(!mngr.find(mdl.uid))
                    arc.mdl[mdl.uid] = mdl;

                if (!!rdy)
                    mdl.init();

                mdl.reg(mngr);

                return mdl;
            },

            boot: function() {
                Object.keys(arc.mdl).forEach(function(k) {
                    arc.mdl[k].init()
                });
                rdy++;
            },

            find: function(n) {
                if(arc.mdl.indexOf(n) !== -1){
                    return arc.mdl[n];
                }
                return 0;
            }
        }

        var mv = function mv(uid, cb){
            var _doc = arc.deps.document,
                _ko = arc.deps.ko;

            function _obs(n, v){
                this[n] = _ko.observable(v);
            }

            _obs.apply(this, ['active', false]);
            _obs.apply(this, ['loader', false]);
            _obs.apply(this, ['msg', false]);

            this.uid = uid;

            this._u = arc.utils;
            this._d = _doc.getElementById(uid);
            this._o = _obs

            this.alert = function(msg){
                this.msg(msg);
                setTimeout(
                    this.msg.bind(null, null),
                    2000)
            }

            this.on = function on(e, d){
                console.warn("Implement runtime callback", e, d)
            };

            this.reg = function reg(mngr){
                this.mngr = mngr;
            }

            this.show = function show() {
                this.active(!0);

                if (this._d.className.indexOf("active") < 0) {
                    this._d.className += " active";
                }

                this._d.className = this._d.className.replace(
                    new RegExp("(^| )hidden($| )", "g"),
                    " "
                );
                this._d.className = this._d.className.replace(
                    new RegExp("(^| )off($| )", "g"),
                    " "
                );
            };

            this.hide = function hide() {
                // create pattern to find class name
                this._d.className = this._d.className.replace(
                    new RegExp("(^| )active($| )", "g"),
                    " "
                );

                if (this._d.className.indexOf("active") < 0) {
                    this._d.className += " off";
                }

                this.active(!1);
            };

            this.init = function initBinding() {
                try{
                    _ko.applyBindings(this, this._d);
                }catch(err){
                    console.error("Error:initBinding", err)
                }
            };

            cb.call(this, function log(msg, dt) {
                console.log("Log:model:", uid, msg, dt);
            });
        };


        function Factory(uid, cb) {
            'use strict';

            var wpr = mngr.find(uid);

            if (!(wpr instanceof mv)) {
                wpr = mngr.reg(new mv(uid, cb))
            }

            return wpr;
        };

        return Factory;
    };

    try{
        module.exports = modexport
    }catch(err){
        /*
         * Call function clss() to get ModelView's static
         * function caller reference
         */
        this.arc.exports(modexport);
    }

}).apply(this);