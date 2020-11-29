// @module [public] ModelView
(function(arc) {
    'use strict';

    var ModelView = (function(arc) {
        'use strict';

        ModelView.ref = "ModelView";
        ModelView.peers = ['ko', 'document'];

        function ModelView(uid, callback){
            if (!(this instanceof ModelView)) {
                return new ModelView(uid, callback);
            }

            this.uid = uid;
            this.loader = arc.ko.observable(null);
            this.loaderctl = {
                hide: this.loader.bind(this, !1),
                show: this.loader.bind(this, !0),
            }
            this.active = arc.ko.observable(null);
            this.msg = arc.ko.observable(null);
            this.errmsg = arc.ko.observable(false);
            this.component = arc.document.getElementById(uid);
            this.tmo;

            if(arc.isSet(callback) && typeof callback == 'function'){
                callback.call(this, function(msg, data){
                    arc.log("<"+uid+"> "+msg, data);
                }, this.loaderctl);
            }
            return this;
        }

        ModelView.prototype = {
            obs: function(n, v){
                this[n] = arc.ko.observable(v);
            },

            notify: function(msg, err, cb){
                this.msg(msg);

                if(arc.isSet(err) && err){
                    this.errmsg(true);
                }

                if(this.tmo)
                    clearTimeout(this.tmo);

                this.tmo = setTimeout(function(){
                    this.msg(null);
                    this.errmsg(false);
                    if(typeof cb === 'function'){
                        cb(this);
                    }
                }.bind(this), 2000);
            },

            on: function(e, d){
                arc.warn("Implement runtime callback", [e, d])
            },

            show: function() {
                this.active(!0);

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
            },

            hide: function() {
                // create pattern to find class name
                this.component.className = this.component.className.replace(
                    new RegExp("(^| )active($| )", "g"),
                    " "
                );

                if (this.component.className.indexOf("active") < 0) {
                    this.component.className += " off";
                }

                this.active(!1);
            },

            initBinding: function() {
                arc.ko.applyBindings(this, this.component);
            }
        }

        return ModelView;
    }(arc));

    arc.add_mod(ModelView)

}(this.arc));