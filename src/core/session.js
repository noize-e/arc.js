/*
 * CHANGELOG - 8/Nov/2020
 *
 * - Modified: Session class now is part of arc's global context: 'arc.session.Session'.
 * - Removed: Session's methods: 'continue' & 'getUrlParam', were totally deprecated.
 * - Added: New setting into arc's configuration object: 'arc.conf.session.initialize'.
 *    * initialize setting enables/disables Session's instance creation on script file load.
 *
 */
(function core_session() {

    var modexport = {
        name: "session"
    }

    modexport.ref = (function() {
        'use strict';

        var _sess, _log;

        function Session(arc) {
            this.memstg = arc.memstg
            _log = arc.log

            // enforces new
            if (!(this instanceof Session)) {
                return new Session(arc);
            }
            // constructor body
        }

        Session.prototype = {

            create: function create(data) {
                this.memstg.add('sdt', data);
                _log(1, "<Session::create>", data)
            },

            check: function check() {
                try {
                    _sess = this.memstg.get('sdt');
                    return _sess != null && _sess.id_token != undefined;
                } catch (err) {
                    return null;
                }
            },

            getData: function getData() {
                return this.memstg.get('sdt');
            },

            getIdToken: function getIdToken() {
                try {
                    return this.get('id_token');
                } catch (err) {
                    return null;
                }
            },

            getAccessToken: function getAccessToken() {
                try {
                    return this.get('access_token');
                } catch (err) {
                    return null;
                }
            },

            add: function add(prop, value, outside) {
                if (!outside) {
                    _sess = this.memstg.get('sdt') || {};
                    _sess[prop] = value;
                    this.memstg.add('sdt', _sess);
                } else {
                    this.memstg.add(prop, value);
                }

                return value;
            },

            get: function get(prop) {
                try {
                    _sess = this.memstg.get('sdt');
                    return _sess[prop];
                } catch (err) {
                    return null;
                }
            },

            remove: function remove(prop) {
                _sess = this.memstg.get('sdt');
                delete _sess[prop];
                this.memstg.add('sdt', _sess);
            },

            destroy: function destroy() {
                this.memstg.remove('sdt');
            }
        };

        return Session;
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }


}).apply(this);