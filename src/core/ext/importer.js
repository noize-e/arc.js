(function _importer(importer) {
    var scripts = [],
        j;
    // The URL of the page itself, without URL fragments or search strings.
    const pageUrl = location.href.split('#')[0].split('?')[0];
    // The URL of the page, up to and including the final '/'.
    const baseUrl = pageUrl.split('/').slice(0, -1).join('/') + '/';

    function add_src(src) {
        if (isArray(src)) {
            scripts = scripts.concat(src);
        } else {
            scripts.push(src);
        }
    }

    function load_css(href, linkRel) {
        const link = document.createElement('link');
        link.type = 'text/css';
        link.href = baseUrl + href;
        link.rel = linkRel;
        document.head.appendChild(link);
    }

    function remove_src(src) {
        const index = scripts.indexOf(src);
        console.log("!!remove - index", index);
        if (index > -1) {
            scripts.splice(index, 1);
        }
        console.log("removed!! - index", index, scripts.indexOf(src));
    }

    /**
     * [importScript description]
     * @param  {[type]} src [description]
     */
    function importScript(src) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.defer = true;
        // Setting async = false is important to make sure the script is imported
        // before the 'load' event fires.
        script.async = false;
        // Implement callback from app context
        script.onload = function onload(e) {
            console.log("importer.on.load:", src);
            console.log("importer.event:", e);

            remove_src(src)

            if (isNull(importer.callback)) {
                importer.onLoaded(e);
            } else {
                importer.callback(e);
            }
        };
        document.head.appendChild(script);
    }

    importer.add = add_src;
    importer.load_css = load_css;
    importer.load = function load(src, callback) {
        importer.callback = callback || null;
        console.log("importer.load: ", src);

        add_src(src);

        try {
            for (j = 0; j < scripts.length; ++j) {
                importScript.call(importer, scripts[j]);
            }
        } catch (err) {
            console.error(err);
        }
    }

}).apply(this, [window.importer = window.importer || {}]);

/**
    Usage:
        // Set the onload event handler
        importer.onLoaded = function(e){
            // your code here
        }

        // you add a src as a string
        importer.add("js/single.js");
        // or as array
        importer.add(["js/single1.js", "js/single2.js"]);
        // and load it/them into the DOM
        load();

        // or just add the source(s) and start the load with single line
        load(["js/single1.js", "js/single2.js"]);
**/