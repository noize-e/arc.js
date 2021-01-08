;(function(arc) {
    'use strict';

    var FormModelWrapper = (function(arc, utils, stdout) {
        'use strict';


        var cachedValues,
            submitedValues,
            required,
            fields,
            events = {
                required_input: 'required_input',
                on_submit: 'on_submit',
                on_error: 'on_error',
                form_error: 'form_error',
                value_changed: 'value_changed'
            };

        function _catch(callback, context) {
            return function() {
                try {
                    callback.call(context);
                } catch (error) {
                    if(!utils.isNull(context.inputError)){
                        stdout.err(error, context.inputError)
                        context.on(events.required_input, context.inputError);
                    }else{
                        stdout.err(error)
                        context.on(events.form_error, error);
                    }
                }
            };
        }  // @private


        function _errid(str){
            return "$_err".replace('$', str);
        }  // @private


        function validateField(id) {
            var value = this[id](),
                isRequired = (required.indexOf(id) !== -1);

            stdout.debug("formView::validateField", {
                id: id,
                value: value,
                required: isRequired
            })

            if ((utils.isNull(value) || !utils.isSet(value) ||
                value == "") && isRequired){
                this.inputError = id + "_err";
                throw new Error("RequiredField");
            }

            submitedValues[id] = value;
        }  // @private


        /**
         * @private createInputField
         * @param {object} ctx A ModelView prototype object
         * @param {object} attrs: { fieldId: {string},
         *                          fieldValue: {*},
         *                          isArrayField: {boolean} }
         */
        function createInputField(ctx, attrs) {
            var id = attrs.fieldId,
                isArrayField =  attrs.isArrayField || !1,
                errid = _errid(id),
                cachedValue = cachedValues[id] || null,
                value = attrs.fieldValue || cachedValue;

            /*
             * If the field is password type exclude
             * from save on local storage
             *
             * Note that only this rule is applied by
             * the given field id string and not for
             * the field input type.
             */
            if (!id.match(/pwd|passw/g)) {
                if(isArrayField){
                    ctx[id] = arc.d.ko.observableArray(value);
                }else{
                    ctx[id] = arc.d.ko.observable(value);
                }
                ctx[errid] = arc.d.ko.observable(false);

                try {
                    ctx[id].subscribe(function(value) {    
                        cachedValues[id] = value;
                        arc.session.add(ctx.uid, cachedValues);
                        ctx.on(events.value_changed, {
                            id: id, value: value
                        })
                    }, ctx); // In test-env the subscribe() method isn't defined
                } catch (err) {
                    stdout.err(err)
                }
            } else {
                ctx[id] = arc.d.ko.observable()
                ctx[errid] = arc.d.ko.observable(false);
            }
        } // @private


        function rmRequiredField(id) {
            var idx = required.indexOf(id);
            if(idx !== -1){
                required.splice(idx, 1);
            }
        } // @private


        function createFields(ctx, rawFields){
            var tmpFields = [];

            rawFields.forEach(function(field){
                var keyval, id;

                if (field.match(/:/g)) {
                    keyval = field.split(":");
                    id = keyval[0];

                    if(keyval[1] == "array"){
                        createInputField(ctx, {
                            fieldId: id,
                            isArrayField: true
                        })
                    }
                }else{
                    id = field;
                    createInputField(ctx, {
                        fieldId: id
                    })
                }

                tmpFields.push(id)
            });

            return tmpFields;
        } // @private


        function FormModelWrapper(ids) {
            submitedValues = {};

            /* From session get stored fields
               values given the form's id, otherwise
               create a new data holder for later use */
            cachedValues = arc.session.get(this.uid) || {};
            fields = createFields(this, ids);
            required = utils.deepCopy(fields); // deep copy


            /**
             * Properties
             */

            Object.defineProperties(this, {
                inputError: {
                    value: null,
                    writable: true,
                    configurable: false,
                    enumerable: false
                },
                required: {
                    configurable: false,
                    get: function() {
                        return required;
                    },
                    set: function(ids) {
                        if(utils.isArray(ids))
                            required = required.concat(id);
                        else required.push(id);
                    }
                },
                evt: {
                    configurable: false,
                    get: function(){
                        return events;
                    },
                    set: function(evts){
                        utils.extend(events, evts);
                    }
                }
            })


            /**
             * Methods
             */

            this.inputField = function(id, value){
                createInputField(this, {
                    fieldId: id,
                    fieldValue: value
                });
                return this;
            }

            this.arrayField = function(id, value){
                createInputField(this, {
                    fieldId: id,
                    fieldValue: value,
                    isArrayField: true
                });
                return this;
            }

            this.exclude = function(req) {
                if(utils.isArray(req)){
                    req.forEach(function(id) {
                        rmRequiredField(id);
                    });
                }else{
                    rmRequiredField(req);
                }
            }

            this.formError = function(id) {
                if(utils.isSet(id))
                    this[id](true); // id format: {*}_err
                else
                    this[this.inputError](true);

                /* To prevent the creation of many timers
                   store the input error, then if a new error
                   comes clear the timer and delete it. */
                setTimeout(function(){
                    this[id](false);
                    this.inputError = null;
                }.bind(this), 2000)

                this.notify(id, true);
            }

            this.onKeypress = function(data , event){
                if (event.which == 13) {
                    this.submit();
                }
                return true;
            }

            this.onSubmit = function() {
                arc.warn("Implement onSubmit() runtime callback");
            }


            this.submit = _catch(function() {
                fields.forEach(validateField.bind(this));
                arc.session.remove(this.uid); // clear fields values from session
                this.onSubmit(submitedValues);
            }, this);


            this.addEvents = function(evts){
                utils.extend(events, evts)
            } // On deprecation

            this.addRequired = function(id) {
                required.push(id);
                return required;
            } // On deprecation
        }


        return FormModelWrapper;

    }(arc, arc.u, arc.c));


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

    }(FormModelWrapper)); // factory

    arc.add_mod(FormModelView) // Add module

}(this.arc));