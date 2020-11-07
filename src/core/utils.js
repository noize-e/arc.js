/*
 * CHANGELOG - 7/Nov/2020
 *
 * 1. Added 2 new functions: serialize & log
 * 2. Removed 'scrollTo' function. Now lives in the extension bundle
 * 3. Added: Test spec: 'src/test/core.utils.spec.js'
 */
(function core_utils(arc) {
    'use strict'

    var prefix = '[utils] > '

    var utils = {

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
                console.log("window object not available", url);
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
            } catch (_unused2) {
                console.log("window object not available", url);
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

    var initmod = function initmod(arc){
        var _ctx = arc.utils,
            _glob = false;

        if(arc.conf.hasOwnProperty('utils')){
            if(arc.conf.utils.globctx){
                _ctx = this;
                _glob = true;
            }
        }

        Object.keys(utils).forEach(function(k) {
           this[k] = utils[k];
        }, _ctx)
    }

    try{
        module.exports = { init: initmod }
    }catch(err){
        initmod.call(this);
    }

}).apply(this);