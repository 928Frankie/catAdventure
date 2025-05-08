// src/javascript/World/WaterBowl.js
import InteractiveObject from './InteractiveObject.js'
import * as THREE from 'three'
export default class WaterBowl extends InteractiveObject {
    constructor(world, options = {}) {
        // Set default options for water bowl
        const waterBowlOptions = {
            modelName: 'waterBowlModel',
            position: options.position,
            scale: options.scale,
            rotation: options.rotation,
            triggerDistance: options.triggerDistance || 1.5,
            animationName: 'drinking',
            interactionType: 'drink',
            hintSignModel: 'waterSignModel',

        }
        
        super(world, waterBowlOptions)
    }
    
    interact() {
        console.log('Cat is drinking from the water bowl');
        super.interact();
    }
}