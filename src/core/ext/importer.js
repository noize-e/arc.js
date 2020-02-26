(function importerScope(global) {

    /** 
        Usage:        
            // Set the onload event handler
            global.importer.onLoaded = function(e){
                // your code here
            }
            
            // you add a src as a string 
            global.importer.add("js/single.js");
            // or as array
            global.importer.add(["js/single1.js", "js/single2.js"]);
            // and load it/them into the DOM
            global.load();

            // or just add the source(s) and start the load with single line
            global.load(["js/single1.js", "js/single2.js"]);
    **/

    var scripts = [],
        // The URL of the page itself, without URL fragments or search strings.
        pageUrl = location.href.split('#')[0].split('?')[0],
        // The URL of the page, up to and including the final '/'.
        baseUrl = pageUrl.split('/').slice(0, -1).join('/') + '/',
        j;

    /**
     * [addSources description]
     * @param {[type]} src [description]
     */
    function addSources(src) {
        if (global.isArray(src))
            scripts = scripts.concat(src)
        else
            scripts.push(src)
    }

    /**
     * [loadRelativeScript description]
     * @param  {[type]} src [description]
     * @return {[type]}     [description]
     */
    function loadRelativeScript(src) {
        importScript(baseUrl + src);
    }

    /**
     * [loadSpecificCss description]
     * @param  {[type]} href    [description]
     * @param  {[type]} linkRel [description]
     * @return {[type]}         [description]
     */
    function loadSpecificCss(href, linkRel) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.href = baseUrl + href;
        link.rel = linkRel;

        document.head.appendChild(link);
    }

    /**
     * [importScript description]
     * @param  {[type]} src [description]
     * @return {[type]}     [description]
     */
    function importScript(src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.defer = true;
        // Setting async = false is important to make sure the script is imported
        // before the 'load' event fires.
        script.async = false;
        // Implement callback from app context
        script.onload = this.onLoaded || function(e) {
            console.log(e)
        }
        document.head.appendChild(script);
    }

    global.importer = {
        add: addSources,
        load: (function load(src) {
            addSources(src)

            try {
                for (j = 0; j < scripts.length; ++j) {
                    importScript.call(global.importer, scripts[j]);
                }
            } catch (err) {
                console.error(err)
            }
        }.bind(this))
    }

})(this)