(function helpersScope(global, $) {

    /**
     * [scrollTo description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    global.scrollTo = function scrollTo(offset) {
        /*$("#Price").offset().top - 10*/
        $('html,body').animate({
            scrollTop: offset
        });
    }

})(this, jQuery);

(function arc_ext_helpers(global) {

    global.isNull = function isNull(obj) {
        return (obj == null)
    };

    global.isSet = function isSet(obj) {
        return typeof obj !== "undefined"
    };

    /**
     * [isArray description]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    global.isArray = function isArray(obj) {
        if (typeof Array.isArray === 'undefined') {
            return Object.prototype.toString.call(obj) === '[object Array]';
        } else {
            return Array.isArray(obj)
        }
    }

    /**
     * [goTo description]
     * @param  {[type]} path   [description]
     * @param  {[type]} notExt [description]
     * @return {[type]}        [description]
     */
    global.goTo = function goTo(path, notExt, external) {
        var local = external ? '' : '/';
        url = local + path + (notExt ? "" : ".html");
        window.location.href = url;
    };

    /**
     * [getUrlParam description]
     * @param  {[type]} parameter    [description]
     * @param  {[type]} defaultvalue [description]
     * @return {[type]}              [description]
     */
    global.getUrlParam = function getUrlParam(parameter, defaultvalue) {
        function getUrlVars() {
            var vars = {},
                parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                    vars[key] = value;
                });
            return vars;
        }
        var urlparameter = defaultvalue;
        if (window.location.href.indexOf(parameter) > -1) {
            urlparameter = getUrlVars()[parameter];
        }
        return urlparameter;
    };

})(window);