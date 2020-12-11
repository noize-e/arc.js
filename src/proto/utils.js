/**
 * CoreModule: Utils
 * Namespacing Status:
 *  arc.u: ok
 */
;(function(arc) {
  'use strict';

    var Utils = (function(stdout){
        'use strict';

        var instance;

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

        function isNull(obj) {
            return obj === null;
        }

        // this only applies with objects
        // properties undefined
        function isSet(obj) {
            return typeof obj !== "undefined";
        }

        // new
        function isFunc(func){
            return Object.prototype.toString.call(func) === "[object Function]";
        }

        // new
        function isObj(obj){
            return Object.prototype.toString.call(obj) === "[object Object]";
        }

        // new
        function owns(obj, prop){
            return obj.hasOwnProperty(prop);
        }

        function isArray(obj) {
            if (typeof Array.isArray === "undefined") {
                return Object.prototype.toString.call(obj) === "[object Array]";
            } else {
                return Array.isArray(obj);
            }
        }

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

        function isEmail(ve) {
            var flt = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return flt.test(ve);
        }

        function deepCopy(obj){
            return JSON.parse(JSON.stringify(obj))
        }


        function hashCode(s) {
          var h = 0, l = s.length, i = 0;
          if ( l > 0 )
            while (i < l)
              h = (h << 5) - h + s.charCodeAt(i++) | 0;
          return h;
        };


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


        // @constructor
        function Utils(arc) {
            if (instance) {
                return instance;
            }

            instance = this;

            arc.u = {};
            _extend(arc.u,  {
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
                hashCode: hashCode
            }, true);
        };

        return Utils;

    }(arc.c));

    Utils(arc);

}(this.arc));