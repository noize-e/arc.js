/*
 * CHANGELOG - 8/Nov/2020
 *
 * - Modified: Session class now is part of arc's global context: 'arc.session.Session'.
 * - Removed: Session's methods: 'continue' & 'getUrlParam', were totally deprecated.
 * - Added: New setting into arc's configuration object: 'arc.conf.session.initialize'.
 *    * initialize setting enables/disables Session's instance creation on script file load.
 *
 */
(function core_session(){
    'use strict';

    var modexport = {
        name: "session"
    }

    modexport.ref = (function() {
        'use strict';

        var clss = function(arc) {
            var data;

            function Session(){
                if (!(this instanceof Session)) {
                    return new Session();
                }

                this.stg = arc.memstg
                this.persist = true;
            }

            Session.prototype = {

                create: function create(dt) {
                    this.tms = Math.floor(Date. now() / 1000)
                    this.stg.add('sess', dt);
                },

                check: function check() {
                    data = this.stg.get('sess');
                    if(arc.isNull(data) && data.hadOwnProperty('id_token')){
                        return true;
                    }
                    return false;
                },

                getData: function getData() {
                    return this.stg.get('sess');
                },

                getIdToken: function getIdToken() {
                    return this.get('id_token');
                },

                getAccessToken: function getAccessToken() {
                    return this.get('access_token');
                },

                add: function add(prop, value, outside) {
                    if (!outside) {
                        data = this.stg.get('sess');
                        data[prop] = value;
                        this.stg.add('sess', data);
                    } else {
                        this.stg.add(prop, value);
                    }

                    return value;
                },

                get: function get(prop) {
                    data = this.stg.get('sess');
                    if(data.hasOwnProperty(prop)){
                        return data[prop];
                    }
                    return null;
                },

                remove: function remove(prop) {
                    data = this.stg.get('sess');
                    delete data[prop];
                    this.stg.add('sess', data);
                },

                destroy: function destroy() {
                    this.stg.remove('sess');
                }
            };

            return new Session();
        }

        return clss;
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }


}).apply(this);