 (function arc_core(global) {

     var models = [],
         directory = {},
         _sess;

     global.Session = {
         create: function(data) {
             global.Storage.add("_sess", data)
         },

         destroy: function() {
             global.Storage.remove("_sess")
         },

         check: function() {
             try {
                 _sess = global.Storage.get("_sess");
                 return (_sess != null && _sess.id_token != undefined);
             } catch (err) {
                 console.warn("Error on session check", err)
             }
         },

         getData: function() {
             try {
                 _sess = global.Storage.get("_sess")
                 if (_sess != null && _sess.id_token !== undefined &&
                     _sess.email !== undefined) {
                     return global.Storage.get("_sess");
                 }
             } catch (err) {
                 console.warn("Error while getting session data", err)
             }
             return null;
         },

         getIdToken: function() {
             try {
                 _sess = global.Storage.get("_sess")
                 return _sess.id_token
             } catch (err) {
                 console.warn("Session.getIdToken error", err)
             }
         },

         getAccessToken: function() {
             try {
                 _sess = global.Storage.get("_sess")
                 return _sess.access_token;
             } catch (err) {
                 console.warn("Session.getAccessToken error", err)
             }
         },

         add: function(prop, value, outside) {
             if (!outside) {
                 _sess = global.Storage.get("_sess") || {};
                 _sess[prop] = value;
                 global.Storage.add("_sess", _sess);
             } else {
                 global.Storage.add(prop, value);
             }
             return value
         },

         get: function(prop) {
             try {
                 _sess = global.Storage.get("_sess");
                 return _sess[prop];
             } catch (err) {
                 return null
             }
         },

         remove: function(prop) {
             _sess = global.Storage.get("_sess");
             delete _sess[prop]
             global.Storage.add("_sess", _sess);
         },

         continue: function(custom) {
             var prev = global.Session.get("previous");
             if (prev != null) {
                 global.Session.remove("previous");
                 global.goTo(prev)
             } else if (custom) {
                 global.goTo(custom, false)
             }
         },

         getUrlParam: function getUrlParam(param) {
             try {
                 var value = global.getUrlParam(param);
                 global.Session.add(param, value);
                 return value;
             } catch (err) {
                 return null
             }
         }
     }


     global.Manager = new function Manager() {
         this.bootstrapped = false;

         this.register = function register(model) {
             models.push(model)
             directory[model.identity] = model;

             if (this.bootstrapped) {
                 model.init();
             }
         }

         this.bootstrap = function bootstrap() {
             for (var i = 0; i < models.length; i++) {
                 models[i].init();
             }
             this.bootstrapped = true;
         }

         this.find = function find(model) {
             try {
                 return directory[model]
             } catch (err) {
                 return null;
             }
         }
     }


 })(this);