/**
 * Module: ModelView
 */
(function(arc) {
    'use strict';

    var ModelView = (function(arc, utils, stdout) {
        'use strict';

        ModelView.ref = "ModelView";
        ModelView.peers = ['ko', 'document'];

        var timer, peers;

        function ModelView(uid, callback){
            if (!(this instanceof ModelView)) {
                return new ModelView(uid, callback);
            }

            peers = arc.d;

            this.uid = uid;
            this.component = peers.document.getElementById(uid);
            this.active = peers.ko.observable(null);
            this.loader = peers.ko.observable(null);
            this.loaderctl = {
                hide: this.loader.bind(this, !1),
                show: this.loader.bind(this, !0),
            }

            /**
             * Stores and renders by 'text' binding any notification.
             * On not null adds '{any-notification-css-class}' to
             *  the DOM element.
             *
             * DOM:
             *     <div data-bind="text: msg, css: {notification: msg}">
             *        ...
             *     </div>
             */
            this.msg = peers.ko.observable(null);
            /**
             * If the notification type is error, set this to true to
             * add '{any-error-css-class}' to the msg dom element.
             *
             * DOM:
             *     <div data-bind="text: msg, css: {error: errmsg, notification: msg}">
             *        ...
             *     </div>
             */
            this.errmsg = peers.ko.observable(false);

            if(utils.isSet(callback) && typeof callback == 'function'){
                callback.call(this,
                    function(msg, data){
                        stdout.log("<"+uid+"> "+msg, data);
                    },
                    this.loaderctl);
            }
            return this;
        }

        ModelView.prototype = {
            obs: function(n, v){
                this[n] = peers.ko.observable(v);
            },

            notify: function(msg, isError, callback){
                this.msg(msg);

                if(utils.isSet(isError) && isError){
                    this.errmsg(true);
                }

                if(timer)
                    clearTimeout(timer);

                timer = setTimeout(function(){
                    this.msg(null);
                    this.errmsg(false);

                    if(typeof callback === 'function'){
                        callback(this);
                    }
                }.bind(this), 2000);
            },

            on: function(e, d){
                stdout.warn("Implement runtime callback", [e, d])
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
                peers.ko.applyBindings(this, this.component);
            }
        }

        return ModelView;

    }(arc, arc.u, arc.c));

    arc.add_mod(ModelView)

}(this.arc));