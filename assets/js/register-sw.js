;(function(exports) {
  exports._registerServiceWorker = register;

  function register(swPath) {
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    navigator.serviceWorker
      .register(swPath)
      .then(function(reg) {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
      }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
      });

    return true;
  }
})(window);

