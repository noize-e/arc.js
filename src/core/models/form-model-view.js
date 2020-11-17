(function core_model_view() {

    var _arc,
        modexport = {
            name: 'new_fmv'
        };

    modexport.ref = (function() {
        'use strict';


        function validateInputsData(callback, context) {
            return function() {
                try {
                    callback.call(context);
                } catch (error) {
                    console.error("Error:validateInputsData", error);
                    // var inputError = context[context.inputError];
                    // inputError(true);
                    // setTimeout(function() { inputError(false); }, 2000);
                    context.on("Input_Error", context.inputError);
                }
            };
        }

        function getInputValue(n) {
            var iv = this[n]();

            if (!iv) {
                this.inputError = n + "_error";
                throw new Error("Error:getInputValue", "R");
            }

            return iv.toLowerCase();
        }

        /**
         * @param::fields  Required input fields
         * @param::callback  Executed on sumbit and fields validation complete
         */
        var FormIO = function FormIO(reqs){
            this._r = reqs;
            this._r.forEach(function(fl){
                this._o.apply(this, [fl, null]);
                this._o.apply(this, ["$_err".replace('$', fl), false])
            }, this);

            /**
             * On submit request executes the input validator
             *
             * On a successful validation cycle it calls the
             * given callback, otherwise throws an exception
             */
            this.onSubmit = function() {
                console.log("Implement submit runtime callback");
            };

            this.submit = validateInputsData(function validate(context) {
                var vs = {};

                this._r.forEach(function(fl){
                    vs[fl] = getInputValue.call(this, fl);
                }, this);

                try {
                    this.onSubmit(vs);
                } catch (err) {
                    console.error(err);
                }
            }, this);
        };

        /**
         * [FormModelView description]
         * @param {[type]}   identity [description]
         * @param {[type]}   fields   [description]
         * @param {Function} callback [description]
         * @return {Function} model
         */
        return function(arc){
            _arc = arc

            return function(uid, ipts, cb) {
                var mld = arc.new_mv(uid, cb);
                FormIO.apply(mld, [ipts]);
                return mld;
            };
        };
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }

}).apply(this);