/*
 * CHANGELOG - 7/Nov/2020
 *
 * 1. Added 2 new functions: serialize & log
 * 2. Removed 'scrollTo' function. Now lives in the extension bundle
 * 3. Added: Test spec: 'src/test/core.utils.spec.js'
 */
(function core_utils(){

    var modexport = {
        name: 'utils'
    }

    modexport.ref = function(arc) {
        'use strict';

        var prefix = '[utils] > ',
            log = arc.log,

        utils = {

            isNull: function isNull(obj) {
                return obj == null;
            },

            isSet: function isSet(obj) {
                return typeof obj !== "undefined"; // return typeof obj !== undefined;
            },

            isArray: function isArray(obj) {
                if (typeof Array.isArray === "undefined") {
                    return Object.prototype.toString.call(obj) === "[object Array]";
                } else {
                    return Array.isArray(obj);
                }
            },

            goTo: function goTo(path, notExt, external) {
                var local = external ? "" : "/";
                var url = local + path + (notExt ? "" : ".html");

                try {
                    window.location.href = url;
                } catch (_unused) {
                    log(2, "<utils::goTo> window object not available");
                }

                return url;
            },

            getUrlVars: function getUrlVars() {
                var vars = {};
                var regex = /[?&]+([^=&]+)=([^&]*)/gi;

                try {
                    window.location.href.replace(regex, function(m, key, value) {
                        vars[key] = value;
                    });
                } catch (err) {
                    log(2, "<utils::getUrlVars> window object not available");
                }

                return vars;
            },

            getUrlParam: function getUrlParam(parameter, defaultvalue) {
                var urlparameter = defaultvalue;

                if (window.location.href.indexOf(parameter) > -1) {
                    urlparameter = getUrlVars()[parameter];
                }

                return urlparameter;
            },

            serialize: function serialize(obj) {
                var str = [];

                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                }

                return str.join("&");
            },

            log: function log(message, data, prefix) {
                console.log(this.prefix || prefix, message, data);
            }
        };

        return utils;
    };

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport)
    }

}).apply(this);