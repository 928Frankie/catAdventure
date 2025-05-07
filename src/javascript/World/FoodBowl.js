// src/javascript/World/FoodBowl.js
import InteractiveObject from './InteractiveObject.js'

export default class FoodBowl extends InteractiveObject {
    constructor(world, options = {}) {
        // Set default options for food bowl
        const foodBowlOptions = {
            modelName: 'foodBowlModel',
            position: options.position,
            scale: options.scale,
            rotation: options.rotation,
            triggerDistance: options.triggerDistance || 1.0,
            animationName: 'eat'
        }
        
        super(world, foodBowlOptions)
    }
    
    onCatEnter() {
        super.onCatEnter()
        // Signal to cat to start eating animation
        this.world.cat.startSpecialAnimation('eat')
    }
    
    onCatLeave() {
        super.onCatLeave()
        // Signal to cat to stop eating animation
        this.world.cat.stopSpecialAnimation()
    }
}