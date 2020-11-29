// @module [private] Manager
;(function(arc) {
    'use strict';

    var models = {};

    function Manager() {
        if (!(this instanceof Manager)) {
            return new Manager();
        }

        this.ready = false;
    }

    function register(model) {
        models[model.uid] = model;
        return model;
    }

    function add_model(model) {
        model = register(model)

        // If ModelManager has already initiliazed the MVs
        // and this new one is added later execute
        // it's init method
        if (!!this.ready){ model.initBinding(); }

        return model;
    }

    function get_model(uid) {
        if(models.hasOwnProperty(uid)){
            return models[uid];
        }
        return null;
    }

    Manager.prototype = arc;

    Manager.prototype.boot = function() {
        Object.keys(models).forEach(function(id) {
            var md = get_model(id)
            md.initBinding()
        });

        this.ready = true;
    }

    Manager.prototype.getModel = get_model;

    Manager.prototype.modelView = function(uid, callback) {
        var mv = this.get_mod("ModelView")
        return add_model.call(this, mv(uid, callback));
    }

    Manager.prototype.formView = function (uid, fields, callback){
        var fmv = this.get_mod("FormModelView")
        return add_model.call(this, fmv(uid, fields, callback));
    }

    arc = Manager();

}(this.arc));