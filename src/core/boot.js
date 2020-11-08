(function(){
    'use strict'

    var arc = {
        mods: [],
        deps: {
            document: null,
            window: null
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