(function core_model_view(arc, ko) {

    var _arc,
        modexport = {
            name: 'formModelView'
        };

    modexport.ref = (function() {
        'use strict';


        function validateInputsData(callback, context) {
            return function() {
                try {
                    callback.call(context);
                } catch (error) {
                    console.log(error); // var inputError = context[context.inputError];
                    // inputError(true);
                    // setTimeout(function() { inputError(false); }, 2000);

                    context.on("Input_Error", context.inputError);
                }
            };
        }

        function getInputValue(inputName) {
            var inputValue = this[inputName]();

            if (!inputValue) {
                this.inputError = inputName + "_error";
                throw new Error("InputError in arc.core.model.getInputValue, line: 37");
            }

            this.loader = _arc.deps.ko.observable(false);
            this.error = _arc.deps.ko.observable(null);
            return inputValue.toLowerCase();
        }

        /**
         * @param::fields  Required input fields
         * @param::callback  Executed on sumbit and fields validation complete
         */
        var FormIO = function FormIO(fields) {
            this.onSubmit =
                this.onSubmit ||
                function() {
                    console.log("CallbackError: Setup submit's callback method");
                }; // Initialize fields as observables

            for (var _i = 0; _i < fields.length; _i++) {
                this[fields[_i]] = _arc.deps.ko.observable(null);
                this[fields[_i] + "_error"] = _arc.deps.ko.observable(false);
            }
            /**
             * On submit request executes the input validator
             *
             * On a successful validation cycle it calls the
             * given callback, otherwise throws an exception
             */

            this.submit = validateInputsData(function validate(context) {
                var values = {};

                for (i = 0; i < fields.length; i++) {
                    values[fields[i]] = getInputValue.call(this, fields[i]);
                }

                try {
                    this.onSubmit(values);
                } catch (e) {
                    // statements
                    console.log(e);
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

        var FormModelView = function FormModelView(identity, fields, callback) {
            var model = _arc.modelView.apply(this, [identity, callback]);
            FormIO.apply(model, [fields]);
            return model;
        };

        return function(arc){
            _arc = arc
            return FormModelView
        };
    }());

    try{
        module.exports = modexport
    }catch(err){
        arc.mods.push(modexport);
    }

}).apply(this);