/*
 * CHANGELOG
 *
 * 1. 'Me.update' method now is part of the C.R.U.D operations
 * 2. Added 'subs' map property as part of 'Me' prototype. It maps:
 *    - 'Me.subs.update' now is in charge of publishing events and notify to it's subscribers.
 *    - Previous 'Me.subscribe' method, now: 'Me.subs.add'.
 *    - Previous 'Me.getSubscribers' method, now: 'Me.subs.get'.
 * 3. C.R.U.D. methods' arguments changed, now: 'req', 'context', 'auth' & 'sync'.
 *
 */
(function core_me() {

    var modexport = {
        name: "me"
    };

    modexport.ref = (function() {
        'use strict';

        var _this = this,
            _idToken,
            _data,
            _subscribers = [],
            _events = {
                ok: "transaction_successfull",
                error: "transaction_error"
            };
        /*
         * Pubsub Handlers
         *
         * subscribe new observers
         */

        var subscribe = function subscribe(observer) {
            _subscribers.push(observer);
        };
        /*
         * publish a topic update to the observers
         */

        var publish = function publish(topic, data) {
            for (var i = 0; i < _subscribers.length; i++) {
                _subscribers[i].update(topic, data);
            }
        };
        /*
         * HTTP request callback.
         */

        var onComplete = function onComplete(d, s) {
            /*
             * The event triggered depends on
             * the transaction's status.
             */
            var event = s == "error" ? _events.error : _events.ok,
                _pub = this.update || publish;

            _pub.call(this, event, d || {});
        };

        var requestData = function requestData(req, context, auth) {
            /*
             * Persistent data saved in memory (local storage)
             */
            _d = this.arc.session.getData();
            /*
             * context object schema
             *
             * json:
             *   event:
             *      ok: "string"
             *      error: "string"
             *   sync: true|false
             *   data:
             *      ref: "string"
             *
             * NOTE: The data.ref parameter makes reference
             * to a session variable name which contains data.
             *
             * If sync is set to true then, the data will be
             * requested to the remote parameter instead of
             * retrieving it from memory.
             *
             */

            _events.ok = context.event.ok || _events.ok;
            _events.error = context.event.error || _events.error;
            /*1
             * If the requested data is already in memory
             * returns it from local storage (session) unless
             * the sync parameter from context object is set
             *
             * Only is triggered the event ok from the
             * current context
             */

            if (!isNull(_d) && !isNull(_d[context.data.ref]) && !context.sync)
                return this.update(_events.ok, _d[context.data.ref]);

            if (auth) {
                this.arc.xclient.setAuthorization(this.arc.session.getIdToken());
            }
            /*
             * Request the data to the remote resource
             *
             * 'req' object schema:
             *
             *   json:
             *      method: get|post|put|delete
             *      uri: "/string/path"
             *      payload: {map}
             *      qs: {map}
             */

            this.arc.xclient[req.method](
                req.uri,
                req.qs || {},
                req.payload || {},
                onComplete.bind(this)
            );
        };
        /*
         *  Me's Prototype
         */

        var Me = function Me(arc) {
            this.callback = null;
            this.arc = arc
        };

        Me.prototype = {
            subs: {
                add: subscribe,
                get: function get() {
                    return _subscribers;
                },
                update: function update(t, d) {
                    /* Publish an update to it's observers */
                    publish(t, d);
                    /* Triggers an event callback */

                    this.on(t, d);
                }
            },
            on: function on() {
                return this;
            },
            destroy: function destroy() {
                this.on("destroy", {});
            },

            /*
             * C.R.U.D. operations mapping
             */
            create: function create(req, context, auth, cb) {
                this.callback = cb || this.callback;
                req.method = "post";
                requestData.call(this, req, context, auth);
            },
            get: function get(req, context, auth) {
                req.method = "get";
                requestData.call(this, req, context, auth);
            },
            update: function update(req, context, auth) {
                req.method = "put";
                requestData.call(this, req, context, auth);
            },
            delete: function _delete(req, context, auth) {
                req.method = "delete";
                requestData.call(this, req, context, auth);
            }
        };

        return Me;

    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }


}).apply(this);