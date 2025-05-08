// src/javascript/World/Bed.js
import InteractiveObject from './InteractiveObject.js'
import * as THREE from 'three'

export default class Bed extends InteractiveObject {
    constructor(world, options = {}) {
        // Set default options for the bed
        const bedOptions = {
            modelName: 'bedModel',  // This should match the key in your resources items
            position: options.position || new THREE.Vector3(-4, 0, 0),
            scale: options.scale,
            rotation: options.rotation || new THREE.Vector3(0, 0, 0),
            triggerDistance: options.triggerDistance || 3.0,
            animationName: 'sleeping',
            interactionType: 'sleep',

            hintSignModel: 'sleepSignModel',
            //hintSignModel: 'waterSignModel',
        }
        
        super(world, bedOptions)
    }
    
    interact() {
        console.log('Cat is sleeping on the bed');
        
        // Start the sleep animation
        if (this.world.cat) {
            this.world.cat.startSpecialAnimation('sleeping');
        }
    }
    
    onCatLeave() {
        console.log(`Cat left ${this.constructor.name} zone`);
        this.isActive = false;
        
        // Stop the sleep animation if the cat is sleeping
        if (this.world.cat && 
            this.world.cat.isInSpecialAnimation && 
            this.world.cat.specialAnimationName === 'sleeping') {
            this.world.cat.stopSpecialAnimation();
        }
        
        // Notify the interaction system
        if (this.world.interactionSystem) {
            this.world.interactionSystem.clearActiveObject(this);
        }
    }
}