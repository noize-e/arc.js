(function(){
    'use strict'

    var arc = {
        mods: [],
        models: {},
        deps: {
            window: null
        }
    }

    arc.deps.document = {
        getElementById: function(identity) {
            // console.log("[mockup] getElementById", identity)
            return {
                identity: identity,
                className: "mockup-classname"
            }
        }
    }

    arc.deps.ko = {
        observable: function(args) {
            // console.log("[mockup] observable", arguments);
            return this.observable
        },
        applyBindings: function(args){
            // console.log("[mockup] applyBindings", arguments);
            return this.applyBindings
        }
    }

    arc.mod_init = function(){
        this.mods.forEach(function(mod){
            arc[mod.name] = new mod.ref(arc)
        })
    }.bind(arc)

    try{
        module.exports = arc;
    }catch(err){
        this.arc = arc;
    }

}).apply(this);