# CHANGELOG

## April 24, 2020

### _core.ext_.__XHRClient__:

+ added HTTP PUT request support.
+ added HTTP DELETE request support.

## April 18, 2020

### _core.model_.__ModelView__

+ The constructor method now receive a prototype object.

### _core.ext_.__Importer__

+ On __load__ function's complete callback the loaded source is removed.

```js
sources = sources.filter(function(src) {
  return src !== loadedSource
})
```