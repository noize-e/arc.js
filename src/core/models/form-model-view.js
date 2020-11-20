(function core_model_view() {

    var _arc,
        modexport = {
            name: 'formModel'
        };

    modexport.ref = (function() {
        'use strict';

        var FormModelView = function FormModelView(arc){

            function _errcatch(callback, ctx) {
                return function() {
                    try {
                        callback.call(ctx);
                    } catch (error) {
                        console.error("Error >>", error);
                        ctx.on("required_input", ctx.inputError);
                    }
                };
            }

            function _validate(n) {
                var iv = this[n]();

                if (!iv) {
                    this.inputError = n + "_err";
                    throw new Error("Required Field");
                }

                return iv.toLowerCase();
            }

            function inputField(uid){
                this.obs(uid);
                this.obs("$_err".replace('$', uid), null);
            }

            var FormIO = function FormIO(fields){
                fields.forEach(inputField.bind(this), this);

                this.exinput = inputField.bind(this)

                this.formError = function(n, err){
                    this.msg(err);
                    this[n](true);

                    setTimeout(function(){
                        this[n](false);
                        this.msg(null);
                    }.bind(this), 2000);
                }

                /**
                 * On submit request executes the input validator
                 *
                 * On a successful validation cycle it calls the
                 * given callback, otherwise throws an exception
                 */
                this.onSubmit = function() {
                    console.log("Implement submit runtime callback");
                };

                this.submit = _errcatch(function(ctx) {
                    var datafields = {};

                    fields.forEach(function(fl){
                        datafields[fl] = _validate.call(this, fl);
                    }, this);

                    this.onSubmit(datafields);
                }, this);
            };

            function Factory(uid, fields, cb) {
                var mld = arc.modelView(uid, function(log, loader){
                    FormIO.apply(this, [fields]);
                    cb.call(this, log, loader)
                });
                return mld;
            };

            return Factory
        };

        return FormModelView;
    }());

    try{
        module.exports = modexport
    }catch(err){
        this.arc.exports(modexport);
    }

}).apply(this);