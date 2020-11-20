/**
 *
 */
(function core_models_modelview() {
    'use strict';

    var modexport = {
        name: "modelView",
        peers: ["ko", "document"]
    };

    modexport.ref = function(arc) {

        var _doc = arc.document,
            _ko = arc.ko;

        function ModelView(uid, cb){
            var _manager;

            this.uid = uid;
            this.loader = _ko.observable(null);
            this.active = _ko.observable(null);
            this.msg = _ko.observable(null);
            this.errmsg = _ko.observable(false);

            this._d = _doc.getElementById(uid);

            this.obs = function(n, v){
                this[n] = _ko.observable(v);
            }

            this.notify = function(msg, err){
                this.msg(msg);

                if(arc.isSet(err) && err){
                    this.errmsg(true);
                }

                setTimeout(function(){
                    this.msg(null);
                    this.errmsg(false);
                }.bind(this), 2000)
            }

            this.on = function on(e, d){
                console.warn("Implement runtime callback", e, d)
            };

            this.reg = function reg(mng){
                _manager = mng;
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
                _ko.applyBindings(this, this._d);
            };

            this.boot = function(){
                _manager.boot()
            }

            cb.call(this, function(msg, dt) {
                console.log(uid, msg, dt);
            },{
                hide: this.loader.bind(this, !1),
                show: this.loader.bind(this, !0),
            });
        };


        function Factory(uid, cb) {
            'use strict';

            var mv = arc.find(uid);
            if (!(mv instanceof ModelView)) {
                mv = arc.reg(new ModelView(uid, cb))
            }

            return mv;
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