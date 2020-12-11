/**
 * Module: FormModelView
 * Namespacing Status:
 *  arc.d: ok
 *  arc.u: ok
 */
;(function(arc) {
    'use strict';

    // @Decorator
    var FormModelWrapper = (function(arc, utils) {
        'use strict';

        // @private vars
        var cachedValues,
            submitedValues,
            required,
            fields;


        // @private
        function _catch(callback, context) {
            return function() {
                try {
                    callback.call(context);
                } catch (error) {
                    if(!utils.isNull(context.inputError)){
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

            arc.debug("formView::validateField", {
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
        }

        // @private
        function createInputField(ctx, attrs) {
            // attrs: { fieldId:str, fieldValue:{*}, isArrayField:bool }
            var id = attrs.fieldId,
                value = attrs.fieldValue || cachedValue,
                isArrayField =  attrs.isArrayField || !1,
                errid = _errid(id),
                cachedValue = cachedValues[id] || null;

            /*
             * If the field is password type exclude
             * from save on local storage
             *
             * Note that only this rule is applied by
             * the given field id string and not for
             * the field input type.
             */
            if (!id.match(/pwd|passw/g)) {
                if(utils.isSet(isArrayField)){
                    ctx[id] = arc.d.ko.observableArray(value);
                }else{
                    ctx[id] = arc.d.ko.observable(value);
                }
                ctx[errid] = arc.d.ko.observable(false);

                try {
                    /*
                     * In test-env the subscribe() method isn't defined
                     */
                    ctx[id].subscribe(function(value) {    
                        cachedValues[id] = value;
                        arc.session.add(ctx.uid, cachedValues);
                    }, ctx);
                } catch (err) {
                    arc.c.err(err)
                }
            } else {
                ctx[id] = arc.d.ko.observable()
                ctx[errid] = arc.d.ko.observable(false);
            }
        }


        // @private
        function rmRequiredField(id) {
            var idx = required.indexOf(id);
            if(idx !== -1){
                required.splice(idx, 1);
            }
        }


        // @private
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
        }


        // @constructor
        function FormModelWrapper(ids) {
            submitedValues = {};
            // From session get stored fields
            // values given the form's id, otherwise
            // create a new data holder for later use
            cachedValues = arc.session.get(this.uid) || {}

            fields = createFields(this, ids);
            // deep copy
            required = utils.deepCopy(fields)

            /*// DECORATOR METHODS //*/

            // @public
            this.inputError = null;

            this.inputField = function(id, value){
                createInputField(this, {
                    fieldId: id,
                    fieldValue: value
                });
                return this;
            }


            // @public
            this.arrayField = function(id, value){
                createInputField(this, {
                    fieldId: id,
                    fieldValue: value,
                    isArrayField: true
                });
                return this;
            }


            // @public
            this.addRequired = function(id) {
                required.push(id);
                return required;
            }


            // @public
            this.exclude = function(req) {
                if(utils.isArray(req)){
                    req.forEach(function(id) {
                        rmRequiredField(id);
                    });
                }else{
                    rmRequiredField(req);
                }
            }


            // @public
            this.formError = function(id, error, cb) {

                // id format: {*}_err
                this[id](true);

                // To prevent the creation of many timers
                // store the input error, then if a new error
                // comes clear the timer and delete it.
                setTimeout(function(){
                    this[id](false);
                    this.inputError = null;
                }.bind(this), 2000)

                if(utils.isSet(error)){
                    this.notify(error, true, function(context) {
                        // this might is buggy. Verify if the id correspond to errId
                        if(utils.isSet(cb) && utils.isFunc(cb))
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
                // clear fields values from session
                arc.session.remove(this.uid);
                this.onSubmit(submitedValues);
            }, this);
        }


        return FormModelWrapper;

    }(arc, arc.u));


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