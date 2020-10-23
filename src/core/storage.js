(function arcStorage(global) {
  // const prefix = '[store] > ';
  let message;
  let item;

  message = 'Sorry, it looks like your browser storage has been corrupted.';
  message += ' Please clear your local storage by deleting cache and cookies.';

  /**
     * LocalStorage Object Decorator
     */
  global.Storage = new function Storage() {
    this.get = function(name) {
      try {
        item = JSON.parse(localStorage.getItem(name));
        return item;
      } catch (e) {
        if (e.name === 'NS_ERROR_FILE_CORRUPTED') {
          alert(message);
        }
      }
      return null;
    };

    this.add = function(name, item) {
      try {
        localStorage.setItem(name, JSON.stringify(item));
        return item;
      } catch (e) {
        if (e.name === 'NS_ERROR_FILE_CORRUPTED') {
          alert(message);
        }
      }
      return null;
    };

    this.remove = function(name) {
      try {
        localStorage.removeItem(name);
      } catch (e) {
        if (e.name === 'NS_ERROR_FILE_CORRUPTED') {
          alert(message);
        }
      }
    };
  };
})(this);
