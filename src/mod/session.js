/**
 * @module Session
 *
 * Ready: utils calls from namespacing
 */
(function(arc) {
    'use strict';

    var Session = (function(utils) {
        'use strict';

        var data, storage;

        Session.ref = "session"
        Session.public = true;

        function Session(arc, conf){
            if (!(this instanceof Session)) {
                return new Session(arc, conf);
            }

            storage = arc.get_mod("Storage")(arc);
        }

        Session.prototype = {

            create: function create(data) {
                if(utils.isNull(this.getData())) {
                    storage.add('sess', data);
                }
            },

            merge: function merge(ndata) {
                data = this.getData()
                utils.extend(data, ndata, true);
                storage.add('sess', data);
            },

            add: function add(prop, value) {
                data = this.getData();
                data[prop] = value;
                storage.add('sess', data);
            },

            get: function get(prop) {
                data = this.getData();
                if(!utils.isNull(data) &&
                    utils.isSet(prop) &&
                    utils.owns(data, prop)){
                    return data[prop];
                }
                return data;
            },

            remove: function remove(prop) {
                data = this.getData();
                delete data[prop];
                storage.add('sess', data);
            },

            getData: function getData() {
                return storage.get('sess');
            },

            getIdToken: function getIdToken() {
                return this.get('id_token');
            },

            getAccessToken: function getAccessToken() {
                return this.get('access_token');
            },

            checkAccess: function checkAccess() {
                data = this.getData();
                if(!utils.isNull(data) && utils.owns(data, 'id_token')){
                    return true;
                }
                return false;
            },

            destroy: function destroy() {
                storage.remove('sess');
                return this;
            }
        };

        return Session;

    }(arc.u));

    arc.add_mod(Session)

}(this.arc));