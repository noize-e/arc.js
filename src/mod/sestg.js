// @module [public] Sestg
(function(arc) {
    'use strict';

    var Sestg = (function(arc) {
        'use strict';

        var data,
            systg;

        Sestg.ref = "sestg"
        Sestg.public = true;
        Sestg.namespace = "session";

        function Sestg(arc, conf){
            if (!(this instanceof Sestg)) {
                return new Sestg(arc, conf);
            }

            this.persist = true;
        }

        Sestg.prototype = {

            create: function create(dt) {
                data = this.getData()
                if(!arc.isNull(data)){
                    arc.extend(data, dt, true)
                }else{
                    data = dt
                }
                arc.systg.add('sess', data);

                return this;
            },

            add: function add(prop, value) {
                data = arc.systg.get('sess');
                if (arc.isNull(data)){
                    data = {}
                    data[prop] = value;
                    this.create(data)
                }else{
                    data[prop] = value;
                    arc.systg.add('sess', data);
                }

                return this;
            },

            get: function get(prop) {
                data = arc.systg.get('sess');
                if(!arc.isNull(data) && arc.isSet(prop) &&
                    data.hasOwnProperty(prop)){
                    data = data[prop];
                }
                return data;
            },

            remove: function remove(prop) {
                data = arc.systg.get('sess');
                delete data[prop];
                arc.systg.add('sess', data);

                return this;
            },

            getData: function getData() {
                return arc.systg.get('sess');
            },

            getIdToken: function getIdToken() {
                return this.get('id_token');
            },

            getAccessToken: function getAccessToken() {
                return this.get('access_token');
            },

            checkAccess: function checkAccess() {
                data = this.getData();
                if(!arc.isNull(data) && arc.owns(data, 'id_token')){
                    return true;
                }
                return false;
            },

            destroy: function destroy() {
                arc.systg.remove('sess');
                return this;
            },
            test: function(){
                console.log(this.getData())
            }
        };

        return Sestg;
    }(arc));

    arc.add_mod(Sestg)

}(this.arc));