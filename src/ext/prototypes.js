;(function() {
    'use strict';

    if (!String.prototype.splice) {
        /**
         * {JSDoc}
         *
         * The splice() method changes the content of a string by removing a range of
         * characters and/or adding new characters.
         *
         * @this {String}
         * @param {number} idx Index at which to start changing the string.
         * @param {number} rem An integer indicating the number of old chars to remove.
         * @param {string} str The String that is spliced in.
         * @return {string} A new string with the spliced substring.
         */
        String.prototype.splice = function(idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
    }

    if(!String.prototype.isEmail){
        /**
         *
         * The isEmail() method validates if the content of a string match an e-mail format by
         * testing it against a regex conditional expression
         *
         * @this {String}
         * @return {boolean} if passes the test or not.
         */
        String.prototype.isEmail = function() {
            var regx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regx.test(this);
        }
    }

}());