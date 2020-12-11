/**
 * @module Session
 *
 * Ready: utils calls from namespacing
 */
(function(arc) {
    'use strict';

    var Session = (function(arc, utils) {
        'use strict';

        var data, storage;

        Session.ref = "sestg"
        Session.public = true;
        Session.namespace = "session";

        function Session(arc, conf){
            if (!(this instanceof Session)) {
                return new Session(arc, conf);
            }

            storage = arc.systg;
        }

        Session.prototype = {

            create: function create(data) {
                storage.add('sess', data);
                return data;
            },

            add: function add(prop, value) {
                var sessData = storage.get('sess');

                if (utils.isNull(sessData)){
                    data = {};
                    data[prop] = value;
                    this.create(data)
                }else{
                    sessData[prop] = value;
                    storage.add('sess', sessData);
                }
            },

            get: function get(prop) {
                data = storage.get('sess');
                if(!utils.isNull(data) && utils.isSet(prop) &&
                    data.hasOwnProperty(prop)){
                    return data[prop];
                }
                return data;
            },

            remove: function remove(prop) {
                data = storage.get('sess');
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

    }(arc, arc.u));

    arc.add_mod(Session)

}(this.arc));