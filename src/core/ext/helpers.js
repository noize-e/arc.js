(function arcExtHelpers(global) {
  global.isNull = function isNull(obj) {
    return (obj == null);
  };

  global.isSet = function isSet(obj) {
    return typeof obj !== undefined;
  };

  global.isDefined = function isSet(obj) {
    return typeof obj !== 'undefined';
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
      return Array.isArray(obj);
    }
  };

  /**
     * [goTo description]
     * @param  {[type]} path   [description]
     * @param  {[type]} notExt [description]
     * @param  {[type]} external [description]
     */
  global.goTo = function goTo(path, notExt, external) {
    const local = external ? '' : '/';
    url = local + path + (notExt ? '' : '.html');
    window.location.href = url;
  };

  /**
   * [getUrlVars description]
   * @return {[type]} [description]
   */
  function getUrlVars() {
    const vars = {};
    const regex = /[?&]+([^=&]+)=([^&]*)/gi;
    window.location.href.replace(regex, function(m, key, value) {
      vars[key] = value;
    });
    return vars;
  }

  /**
     * [getUrlParam description]
     * @param  {[type]} parameter    [description]
     * @param  {[type]} defaultvalue [description]
     * @return {[type]}              [description]
     */
  global.getUrlParam = function getUrlParam(parameter, defaultvalue) {
    let urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
      urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
  };
})(window);

(function arcExtHelpers(global, $) {
  /**
     * [scrollTo description]
     * @param  {[type]} offset [description]
     */
  global.scrollTo = function scrollTo(offset) {
    /* $("#Price").offset().top - 10*/
    $('html,body').animate({
      scrollTop: offset,
    });
  };
})(this, jQuery);
