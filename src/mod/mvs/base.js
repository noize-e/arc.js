/**
 * Module: ModelView
 */
(function(arc) {
    'use strict';

    var ModelView = (function(arc, utils, stdout, ext) {
        'use strict';

        ModelView.ref = "ModelView";
        ModelView.peers = ['ko', 'document'];

        var timer, peers, dom, ko;

        function ModelView(uid, callback){
            if(!utils.isSet(callback) || !utils.isFunc(callback)){
                throw new Error("The callback function is not set correctly.");
            }

            if (!(this instanceof ModelView)) {
                return new ModelView(uid, callback);
            }

            dom = arc.d.document;
            ko = arc.d.ko

            Object.defineProperties(this, {
                uid: {
                    value: uid,
                    writable: false,
                    configurable: false,
                    enumerable: true
                },
                component: {
                    value: dom.getElementById(uid),
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                log: {
                    configurable: false,
                    enumerable: false,
                    set: function(v){
                        throw new Error("log cannot be modified")
                    },
                    get: function(){
                        return function(msg, data){
                            stdout.log("<"+this.uid+"> "+msg, data);
                        }.bind(this)
                    }
                }
            });

            this.active = ko.observable(null);
            this.loader = ko.observable(null);
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
            this.msg = ko.observable(null);
            /**
             * If the notification type is error, set this to true to
             * add '{any-error-css-class}' to the msg dom element.
             *
             * DOM:
             *     <div data-bind="text: msg, css: {error: errmsg, notification: msg}">
             *        ...
             *     </div>
             */
            this.errmsg = ko.observable(false);

            callback.call(this, this.log, this.loaderctl);
        }

        ModelView.prototype = {
            obs: function(n, v){
                this[n] = ko.observable(v);
            },

            observer: function(n, v){
                this[n] = ko.observable(v);
            },

            observers: function(n, v){
                this[n] = ko.observableArray(v);
            },

            notify: function(msg, isError, callback){
                this.msg(ext.labels(msg));

                if(utils.isSet(isError) && isError){
                    this.errmsg(true);
                }

                if(timer)
                    clearTimeout(timer);

                timer = setTimeout(function(){
                    this.msg(null);
                    this.errmsg(false);

                    if(utils.isFunc(callback))
                        callback(this);
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
                ko.applyBindings(this, this.component);
            }
        }

        return ModelView;

    }(arc, arc.u, arc.c, arc.e));

    arc.add_mod(ModelView)

}(this.arc));