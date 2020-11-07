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
}).apply(this, [this.jQuery]);
