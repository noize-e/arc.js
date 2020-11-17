(function() {
    var _lvls = ["[info]", "[warn]", "[error]"],
        _mods = [];

    function _instanceof(left, right) {
        if (
            right != null &&
            typeof Symbol !== "undefined" &&
            right[Symbol.hasInstance]
        ) {
            return !!right[Symbol.hasInstance](left);
        } else {
            return left instanceof right;
        }
    }

    function extend(left, right) {
        if (_instanceof(right, Object)) {
            Object.keys(right).forEach(function(k) {
                try{
                    //console.log("left has", k, "?", left.hasOwnProperty(k));
                    //console.log("right is not an object? ", !_instanceof(right[k], Object));
                    if (left.hasOwnProperty(k) && !_instanceof(right[k], Object)) {
                        left[k] = right[k]; //console.log(left[k], right[k])
                    } else {
                        extend(left[k], right[k]);
                    }
                } catch (err) {
                    console.error("Error:extend", err);
                }
            });
        }
    }


    function add_dep(n, v) {
        try {
            if (!this.deps.hasOwnProperty(n)) {
                this.deps[n] = v;
            }
        } catch (err) {
            console.error("Error:add_dep", err);
        }
    }

    function init_mods() {
        _mods.forEach(function(mod) {
            try {
                if (!mod.hasOwnProperty("ready")) {
                    this[mod.name] = new mod.ref(this);
                    mod.ready = true;
                }
            } catch (err) {
                console.error("Error:init_mods", err);
            }
        }, this);
    }

    function init_deps(deps) {
        Object.keys(deps).forEach(function(k) {
            add_dep.call(this, k, deps[k]);
        }, this);
    }

    var arc = function() {
        // enforces new
        if (!_instanceof(this, arc)) {
            return new arc();
        }

        this.conf = {
            stdout: true,
            api: {
                httpMethods: ["GET", "POST", "PUT", "DELETE"],
                contentType: "application/json",
                dataType: "json",
                headers: {
                    Allow: "*"
                },
                gateway: {
                    key: null,
                    invoke_url: null
                }
            },
            cognito: {
                poolId: null,
                region: "us-east-1",
                domain: null,
                clientId: null,
                endpoints: {
                    redirectUri: null,
                    authorize: {
                        path: "/oauth2/authorize",
                        qs: "response_type=code&scope=openid+profile+aws.cognito.signin.user.admin&state=STATE"
                    }
                }
            }
        };
        this.deps = {};
        this.mdl = [];
    }

    arc.prototype = {
        log: function(lvl, msg, data){
            console.log(_lvls[parseInt(lvl) - 1], msg, data || "");
        },

        exports: function(mod) {
            console.log(mod)
            _mods.push(mod);
        },

        init: function(conf, deps) {
            extend(this.conf, conf)
            init_deps.call(this, deps || {});
            init_mods.call(this);
        }
    }

    try {
        module.exports = new arc();
    } catch (err) {
        this.arc = new arc();
    }
}).apply(this);