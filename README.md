# Arc3

---

## 1. Release

- Version: __`3.0.6`__
- Stage: __`beta`__

---

## 2. Bundles

### Core

Includes:
    
- XHRClient
- Importer
- Helpers
    + isNull()
    + isSet()
    + isArray()
    + goTo()
    + getUrlParam()
- Storage
- Session
- Manager
- ModelView
- FormModelView

### Ext

- CognitoAuth
- FacebookLogin
- PayPal
- Helpers
    + scrollTo()
- Toasts
    + showError()
    + showSuccess()
    + showPrimary()

### Files Tree

```
src
├── core
│   ├── core.js
│   ├── ext
│   │   ├── helpers.js
│   │   └── importer.js
│   ├── model.js
│   ├── storage.js
│   └── xhr
│       └── client.min.js
└── ext
    ├── auth
    │   ├── cognito.js
    │   └── facebook.js
    ├── paypal.js
    └── toasts.js
```

---

## 3. Distribution

### Compilation

1. Clousure Compile [[link](https://closure-compiler.appspot.com/home)]
2. Ofuscate script [[online](https://www.javascriptobfuscator.com/Javascript-Obfuscator.aspx)]

---

## 4. Resources

1. [NPM Licence](https://www.freecodecamp.org/news/how-open-source-licenses-work-and-how-to-add-them-to-your-projects-34310c3cf94/
https://medium.com/@vovabilonenko/licenses-of-npm-dependencies-bacaa00c8c65)
