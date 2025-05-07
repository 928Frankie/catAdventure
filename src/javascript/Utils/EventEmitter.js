// src/javascript/Utils/EventEmitter.js
export default class EventEmitter {
    constructor() {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(names, callback) {
        // Create array of names if only one name provided
        const namesArray = typeof names === 'string' ? [names] : names

        for(const name of namesArray) {
            // Create namespace if it doesn't exist
            if(!(this.callbacks[name] instanceof Object))
                this.callbacks[name] = []

            // Add callback
            this.callbacks[name].push(callback)
        }

        return this
    }

    trigger(name, args = []) {
        // Error if name not found
        if(!this.callbacks[name] || this.callbacks[name].length === 0)
            return false

        // Call all callbacks for this name
        for(const callback of this.callbacks[name]) {
            callback(...args)
        }

        return true
    }
}