;(function(ns) {
     /**
     * localStorage manipulation
     */
    function saveItem(name, value) {
        localStorage.setItem(name, value);
    }
    function loadItem(name) {
        return localStorage.getItem(name);
    }
    function removeItem(name) {
        localStorage.removeItem(name);
    }
    function clearItems() {
        localStorage.clear()
    }
    
    ns.Storage = {
        save: saveItem,
        load: loadItem,
        remove: removeItem,
        removeAll: clearItems
    } 
})(App);