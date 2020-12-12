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
}());