/*
 * CHANGELOG - 8/Nov/2020
 *
 * - Modified: Importer class now is part of arc's global context: 'arc.importer::Importer'.
 * - Added: New setting into arc's configuration object: 'arc.conf.importer.initialize'.
 *    * initialize setting enables/disables Importer's instance creation on script file load.
 *
 * Usage:
 *    var importer = new arc.Importer()
 *    importer.on = function(e, d){
 *          switch(e){
 *              case 'import_ok':
 *                  ....
 *                  break;
 *              case 'import_error':
 *                  ....
 *                  break;
 *          }
 *    }
 *
 *    importer.load("js/single.js");
 *
 **/
(function core_ext_importer(arc){

    var instance;

    var clss = (function() {
        'use strict';

        var src_paths = [];

        function add_src(src) {
            if (this.utils.isArray(src)) {
                src_paths = src_paths.concat(src);
            } else {
                src_paths.push(src);
            }
        }

        function remove_src(src) {
            var ixpos = src_paths.indexOf(src);
            if(ixpos > -1){ src_paths.splice(ixpos, 1);}
        }

        function onload(e) {
            // console.log("importer.on.load:", src);
            // console.log("importer.event:", e);
            remove_src(src);

            if (!this.callback) {
                this.on("import_success", e);
            } else {
                this.callback(e);
            }
        }

        function import_src(src) {
            if(!this.dom){
                throw new Error("ImportDepError: missing document object");
            }

            var element = this.dom.createElement("script");
            element.type = "text/javascript";
            element.src = src;
            element.defer = true;
            /*
             * Setting async = false is important to
             * make sure the script is imported before
             * the 'load' event fires.
             */
            element.async = false;
            element.onload = onload.bind(this);
            this.dom.head.appendChild(element);
        };


        function Importer(arc) {
            this.callback = null;
            // required args
            this.utils = arc.utils;
            // optional args
            this.dom = arc.deps.document || null;

            // enforces new
            if (!(this instanceof Importer) && !instance) {
                instance = new Importer(utils, document);
            }

            return instance
        }

        Importer.prototype.load = function(src, cb) {
            this.callback = cb || this.callback;

            add_src(src);

            try {
                src_paths.forEach(function(src) {
                    import_src.call(this, src);
                }, this);
            } catch (err) {
                this.on("import_error", err);
            }
        };

        return Importer;
    }());

    try{
        module.exports = {
            name: "Importer",
            ref: clss
        }
    }catch(err){
        arc.Importer = clss;
    }

}).apply(this, [this.arc = this.arc || {}]);