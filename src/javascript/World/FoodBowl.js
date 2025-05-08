// src/javascript/World/FoodBowl.js
import InteractiveObject from './InteractiveObject.js'
import * as THREE from 'three'

export default class FoodBowl extends InteractiveObject {
    constructor(world, options = {}) {
        // Set default options for food bowl
        const foodBowlOptions = {
            modelName: 'foodBowlModel',
            position: options.position,
            scale: options.scale || new THREE.Vector3(3, 3, 3),
            rotation: options.rotation,
            triggerDistance: options.triggerDistance || 1.5,
            animationName: 'eating',
            interactionType: 'eat',
            hintSignModel: options.hintSignModel || 'foodSignModel',
            //hintSignModel: 'waterSignModel',
        }
        
        super(world, foodBowlOptions)
    }
    
    interact() {
        console.log('Cat is eating from the food bowl');
        super.interact();
    }
}