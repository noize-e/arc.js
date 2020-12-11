;(function(arc) {
    'use strict';

    var Labels = (function(utils, stdout) {
        'use strict';

        var list = {};

        function get(label) {
            stdout.log(label)

            if(utils.isSet(label) &&
                list.hasOwnProperty(label)){
                return list[label]
            }
            return label
        }

        function add(labels){
            utils.extend(list, labels)
        }

        return {
            get: get,
            add: add
        };

    }(arc.u, arc.c));

    arc.add_ext('labels', Labels);

}(this.arc));