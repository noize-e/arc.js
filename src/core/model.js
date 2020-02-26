/**
 * @param  global: window objedt
 * @param  ko:     knockoutJS
 */
(function arc_model(global, ko) {
    /**
     * @private 
     *     log
     *     validateInputsData
     *     getInputValue
     *     FormIO
     */
    function log(message, data, prefix) {
        console.log((this.prefix || prefix), message, data)
    }

    function validateInputsData(callback, context) {
        return function() {
            try {
                callback.call(context);
            } catch (error) {
                console.log(error)
                // var inputError = context[context.inputError];
                // inputError(true);

                // setTimeout(function() { inputError(false); }, 2000);
                context.on("Input_Error", context.inputError)
            }
        }
    }

    function getInputValue(inputName) {
        var inputValue = this[inputName]();

        if (!inputValue) {
            this.inputError = inputName + '_error';
            throw 'InputError';
        }

        this.loader = ko.observable(false); // btn loader
        this.error = ko.observable(null); // error message holder
        return inputValue.toLowerCase();
    }

    /**
     * @param  fields:   Required input fields
     * @param  callback: Executed on sumbit and fields validation complete
     *
     *      var formIO = new FormIO(["username", "email"], function onSubmit(values){
     *          ...
     *      });
     *
     *      var formIo = new FormIO(["username", "email"]);
     *      formIo.onSubmit = function onSubmit(values){
     *          ...
     *      }
     */
    var FormIO = function FormIO(fields) {
        this.onSubmit = this.onSubmit || function() {
            console.log("CallbackError: Setup submit's callback method")
        };

        // Initialize fields as observables
        for (var i = 0; i < fields.length; i++) {
            this[fields[i]] = ko.observable(null);
            this[fields[i] + "_error"] = ko.observable(false);
        }

        /**
         * On submit, it calls the input validator, checking if the pre-defined
         * required fields are fullfiled. On a successful validation cycle it calls the
         * given callback, otherwise throws an exception
         */
        this.submit = validateInputsData(function validate(context) {
            var values = {}
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
    }

    /**
     * create a global Model object and bind it to its DOM element reference.
     * @param identity:  The global object name and DOM element ID.
     * @param callback:  On model's setup complete execute ko bindings
     */
    global.ModelView = function ModelView(identity, callback) {
        global[identity] = new function modelWrapper() {
            this.domComponent = document.getElementById(identity);
            this.identity = identity;
            this.prefix = "[mod] > " + identity;
            this.active = ko.observable(false);
            this.loader = ko.observable(false);
            this.error = ko.observable(false);
            this.log = log

            this.on = function on() {},

                this.showError = function showError(err) {
                    this.error(err);
                    setTimeout(this.error.bind(null, null), 2000);
                }

            this.show = function show() {
                this.active(true);
                if (this.domComponent.className.indexOf('active') < 0) {
                    this.domComponent.className += ' active';
                }

                this.domComponent.className = this.domComponent.className.replace(
                    new RegExp('(^| )hidden($| )', 'g'), ' '
                );

                this.domComponent.className = this.domComponent.className.replace(
                    new RegExp('(^| )off($| )', 'g'), ' '
                );
            }

            this.hide = function hide() {
                // create pattern to find class name
                this.domComponent.className = this.domComponent.className.replace(
                    new RegExp('(^| )active($| )', 'g'), ' '
                );

                if (this.domComponent.className.indexOf('active') < 0) {
                    this.domComponent.className += ' off';
                }

                this.active(false);
            }

            this.showLoader = function showLoader() {
                this.loader(true);
            }

            this.hideLoader = function hideLoader() {
                this.loader(false);
            }

            this.init = function init() {
                ko.applyBindings(this, this.domComponent);
            }

            callback.call(this, log.bind(this))
        }

        return global[identity];
    }

    /**
     * [FormModelView description]
     * @param {[type]} identity [description]
     * @param {[type]} fields   [description]
     */
    global.FormModelView = function FormModelView(identity, fields, callback) {
        var model = ModelView.apply(this, [identity, callback]);
        FormIO.apply(model, [fields]);
        return model
    }

    global.log = log

})(this, ko);


/**
 * @global 
 *     ModelView
 *          var modelView = new ModelView("id", 
 *              function onBootstraped(log){
 *                  this.customObservable = ko.observable()
 *                  this.customAttribute = "My custom attribute"
 *              }
 *          );
 *
 *          // pre-binding 
 *          modelView.on = function onEvent(event, data){
 *              ...
 *          }
 *          modelView.init();
 *
 *          // post-binding
 *          modelView.show();
 *          modelView.hide();          
 *          modelView.showError("Opps this is an error")
 * 
 *     FormModelView
 *
 *          var fmv = new FormModelView("id", ["email", "password"],
 *              function onBootstrap(log){
 *                  this.customObservable = ko.observable()
 *
 *                  // On submit callback
 *                  this.onSubmit = function onSubmit(data){
 *                       ...
 *                  }
 *              }
 *          )
 */