;(function(arc) {
    'use strict';

    var list = {};

    arc.e.property('labels', {
        get: function(){
            return function(label) {
                arc.c.log(label)

                if(arc.u.isSet(label) &&
                    list.hasOwnProperty(label)){
                    return list[label]
                }
                return label
            }
        },
        set: function(labels){
            arc.u.extend(list, labels)
        }
    });

}(this.arc));