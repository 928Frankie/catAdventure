// src/javascript/Utils/Time.js
import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick', [])  // Pass an empty array instead of nothing

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}