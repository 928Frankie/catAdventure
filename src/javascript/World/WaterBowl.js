// src/javascript/World/WaterBowl.js
import InteractiveObject from './InteractiveObject.js'

export default class WaterBowl extends InteractiveObject {
    constructor(world, options = {}) {
        // Set default options for water bowl
        const waterBowlOptions = {
            modelName: 'waterBowlModel',
            position: options.position,
            scale: options.scale,
            rotation: options.rotation,
            triggerDistance: options.triggerDistance || 1.0,
            animationName: 'drink'
        }
        
        super(world, waterBowlOptions)
    }
    
    onCatEnter() {
        super.onCatEnter()
        // Signal to cat to start drinking animation
        this.world.cat.startSpecialAnimation('drink')
    }
    
    onCatLeave() {
        super.onCatLeave()
        // Signal to cat to stop drinking animation
        this.world.cat.stopSpecialAnimation()
    }
}