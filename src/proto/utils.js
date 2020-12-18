/**
 * CoreModule: Utils
 * Namespacing Status:
 *  arc.u: ok
 */
;(function(arc) {
    'use strict';

    var Utils = (function(stdout){
        'use strict';

        function _instanceof(left, right) {
            if (
                right != null &&
                typeof Symbol !== "undefined" &&
                right[Symbol.hasInstance]
            ) {
                return !!right[Symbol.hasInstance](left);
            } else {
                return left instanceof right;
            }
        }

        /**
         * Validators:
         *  isNull     {*}
         *  isSet      {*}
         *  isFunc     {*}
         *  isObj      {*}
         *  isEmail    {*}
         *  isArray    {*}
         */

        function isNull(obj) {
            return obj === null;
        }

        // this only applies with objects
        // properties undefined
        function isSet(obj) {
            return typeof obj !== "undefined";
        }

        function isFunc(func){
            return Object.prototype.toString.call(func) === "[object Function]";
        }

        function isObj(obj){
            return Object.prototype.toString.call(obj) === "[object Object]";
        }

        function isEmail(ve) {
            var flt = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return flt.test(ve);
        }

        function isArray(obj) {
            if (typeof Array.isArray === "undefined") {
                return Object.prototype.toString.call(obj) === "[object Array]";
            } else {
                return Array.isArray(obj);
            }
        }


        /**
         * Detection:
         */

        /**
         *
         * Shortcut method for Object.prototype.hasOwnProperty
         *
         * @param {string} property The property key string to detect
         * @return {boolean} if passes the test or not.
         */
        function owns(obj, arg){
            var v = 0;
            if(isArray(arg)){
                arg.forEach(function(prop) {
                    if(obj.hasOwnProperty(prop))
                        v++
                })
                return (arg.length == v)
            }

            return obj.hasOwnProperty(arg)
        }

        /**
         * Retrieval:
         */

        function getUrlVars() {
            var vars = {};
            var regex = /[?&]+([^=&]+)=([^&]*)/gi;

            try {
                window.location.href.replace(regex, function(m, key, value) {
                    vars[key] = value;
                });
            } catch (err) {
                stdout.warn("window object not available");
            }

            return vars;
        }

        function getUrlParam(parameter, defaultvalue) {
            var urlparameter = defaultvalue;

            if (window.location.href.indexOf(parameter) > -1) {
                urlparameter = getUrlVars()[parameter];
            }

            return urlparameter;
        }

        function serialize(obj) {
            var str = [];

            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }

            return str.join("&");
        }


        function deepCopy(obj){
            return JSON.parse(JSON.stringify(obj))
        }


        function hashCode(s) {
          var h = 0, l = s.length, i = 0;

          // given that a string number is hashed
          // to 0 return it untouched
          if(!isNaN(s))
            return s;

          if ( l > 0 )
            while (i < l)
              h = (h << 5) - h + s.charCodeAt(i++) | 0;
          return h;
        };

        /**
         * Only works with nodejs or a polyfill should be implemented
         */
        function bufferEncoding(str, _from, _to){
            return Buffer.from(str, _from).toString(_to)
        }

        var base64 = {
            encode: function(str){
                return bufferEncoding(str, 'binary', 'base64');
            },
            decode: function (str) {
                return bufferEncoding(str, 'base64', 'binary');
            }
        }

        function numberOnly(element) {
            /**
             * This removes any other character but numbers as entered by user
             *
             * Usage:
             *  <input type="text" oninput="arc.u.numberOnly(this);" maxlength="3" />
             */
            element.value = element.value.replace(/[^0-9]/gi, "");
        }


        function goTo(uri, conf) {
            var _url = '/' + uri,
                _conf = {
                    ext: false,
                    delay: false
                }

            _extend(_conf, (conf || {}))

            if(_conf.ext){
                _url = uri;
            }

            try {
                if(_conf.delay){
                    setTimeout(function(){
                        window.location.href = _url;
                    }, parseInt(_conf.delay));
                }else{
                    window.location.href = _url;
                }
            } catch (err) {
                stdout.warn(err);
            }

            return _url;
        }

        /*
         * In deprecation, it will be replaced by Object.assign(polifyll)
         */
        function _extend(left, right, merge) {
            Object.keys(right).forEach(function(k) {
                if (owns(right, k) && !isSet(merge) && !isObj(right[k])) {
                    left[k] = right[k];
                }
                else if (owns(right, k) && isSet(merge) && !isObj(right[k])) {
                    left[k] = right[k];
                }
                else {
                    _extend(left[k], right[k]);
                }
            });
        }

        arc.namespace("u")

        arc.u.properties({
            isNull: isNull,
            isSet: isSet,
            isArray: isArray,
            isEmail: isEmail,
            isFunc: isFunc,
            isObj: isObj,
            goTo: goTo,
            getUrlVars: getUrlVars,
            getUrlParam: getUrlParam,
            serialize: serialize,
            instanceof: _instanceof,
            extend: _extend,
            owns: owns,
            deepCopy: deepCopy,
            hashCode: hashCode,
            numberOnly: numberOnly
        }, {
            writable: false,
            configurable: false,
            enumerable: false
        }).lock();

    }(arc.c));

}(this.arc));