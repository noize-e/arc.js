// @module [private] FormModelWrapper
// @Module FormModelView
;(function(arc) {
    'use strict';

    // @Decorator
    var FormModelWrapper = (function(arc) {
        'use strict';

        // @private vars
        var cachedValues,
            submitedValues,
            required,
            optsFields,
            fields;


        // @private
        function _catch(callback, context) {
            return function() {
                try {
                    callback.call(context);
                } catch (error) {
                    if(!arc.isNull(context.inputError)){
                        arc.err(error, context.inputError)
                        context.on("required_input", context.inputError);
                    }else{
                        context.on("form_error", error);
                    }
                }
            };
        }

        // @private
        function _errid(str){
            return "$_err".replace('$', str);
        }

        // @private
        function validateField(id) {
            var value = this[id](),
                isRequired = (required.indexOf(id) !== -1);

            arc.log("validate", {
                id: id,
                value: value,
                required: isRequired
            })

            if ((arc.isNull(value) || !arc.isSet(value) ||
                value == "") && isRequired){
                this.inputError = id + "_err";
                throw new Error("RequiredField");
            }

            submitedValues[id] = value;
        }

        // @private
        function inputField(id, value, arr) {
            var errid = _errid(id),
                cachedValue = cachedValues[id] || null;

            value = value || cachedValue;

            /*
             * If the field is password type exclude
             * from save on local storage
             *
             * Note that only this rule is applied by
             * the given field id string and not for
             * the field input type.
             */
            if (!id.match(/pwd|passw/g)) {
                if(arc.isSet(arr)){
                    this[id] = arc.ko.observableArray(value);
                }else{
                    this[id] = arc.ko.observable(value);
                }
                this[errid] = arc.ko.observable(false);

                try {
                    /*
                     * In test-env the subscribe() method isn't defined
                     */
                    this[id].subscribe(function(value) {    
                        cachedValues[id] = value;
                        arc.sestg.add(this.uid, cachedValues);
                    }, this);
                } catch (err) {
                    arc.err(err)
                }
            } else {
                this[id] = arc.ko.observable()
                this[errid] = arc.ko.observable(false);
            }
        }


        // @private
        function rmRequiredField(id) {
            var idx = required.indexOf(id);
            if(idx !== -1){
                required.splice(idx, 1);
            }
        }

        function reMapFields(rawFields, ctx){
            var mappedFields = [];

            rawFields.forEach(function(field){
                var keyval, id;

                if (field.match(/:/g)) {
                    keyval = field.split(":");
                    id = keyval[0];

                    if(keyval[1] == "array"){
                        inputField.call(ctx, id, true)
                    }
                }else{
                    id = field;
                    inputField.call(ctx, id)
                }

                mappedFields.push(id)
            });

            return mappedFields;
        }


        // @constructor
        function FormModelWrapper(ids) {
            submitedValues = {};
            // From session get stored fields
            // values given the form's id, otherwise
            // create a new data holder for later use
            cachedValues = arc.sestg.get(this.uid) || {}

            fields = reMapFields(ids, this);
            required = fields;

            /*// DECORATOR METHODS //*/

            // @public
            this.inputError = null;

            this.inputField = inputField.bind(this)


            // @public
            this.arrayField = function(id, value){
                return inputField.call(this, id, value, true);
            }


            // @public
            this.addRequired = function(id) {
                required.push(id);
                return required;
            }


            // @public
            this.exclude = function(req) {
                if(arc.isArray(req)){
                    req.forEach(function(id) {
                        rmRequiredField(id);
                    });
                }else{
                    rmRequiredField(req);
                }
            }


            // @public
            this.formError = function(id, error, cb) {
                this[id](true);

                // To prevent the creation of many timers
                // store the input error, then if a new error
                // comes clear the timer and delete it.
                setTimeout(function(){
                    this[id](false);
                    this.inputError = null;
                }.bind(this), 2000)

                if(arc.isSet(error)){
                    this.notify(error, true, function(context) {
                        // this might is buggy. Verify if the id correspond to errId
                        if(arc.isSet(cb) && arc.isFunc(cb))
                            cb(context);
                    });
                }

                return this;
            }


            // @public
            this.onKeypress = function(data , event){
                if (event.which == 13) {
                    //call method here
                    this.submit();
                }
                return true;
            }


            // @public
            this.onSubmit = function() {
                arc.warn("Implement onSubmit() runtime callback");
            }


            // @public
            this.submit = _catch(function() {
                fields.forEach(validateField.bind(this));
                this.onSubmit(submitedValues);
                // clear fields values from session
                arc.sestg.remove(this.uid)
            }, this);
        }


        return FormModelWrapper;
    }(arc));


    // @factory
    var FormModelView = (function(wrapper) {
        'use strict';

        FormModelView.ref = "FormModelView"
        FormModelView.peers = ['ko', 'document'];

        function FormModelView(uid, fields, callback){
            return arc.get_mod('ModelView')(uid, function(log, loader){
                wrapper.apply(this, [fields])
                callback.call(this, log, loader)
            })
        }

        return FormModelView;

    }(FormModelWrapper));

    // Add module
    arc.add_mod(FormModelView)

}(this.arc));