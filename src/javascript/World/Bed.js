// src/javascript/World/Bed.js
import InteractiveObject from './InteractiveObject.js'
import * as THREE from 'three'

export default class Bed extends InteractiveObject {
    constructor(world, options = {}) {
        // Set default options for the bed
        const bedOptions = {
            modelName: 'bedModel',  // This should match the key in your resources items
            position: options.position || new THREE.Vector3(-4, 0, 0),
            scale: options.scale || new THREE.Vector3(3, 3, 3),
            rotation: options.rotation || new THREE.Vector3(0, 0, 0),
            triggerDistance: options.triggerDistance || 2.0,
            animationName: 'sleeping'
        }
        
        super(world, bedOptions)
    }
    
    onCatEnter() {
        super.onCatEnter()
        // Signal to cat to start sleeping animation
        this.world.cat.startSpecialAnimation('sleeping')
        
        console.log('Cat is on the bed and sleeping')
    }
    
    onCatLeave() {
        super.onCatLeave()
        // Signal to cat to stop sleeping animation
        this.world.cat.stopSpecialAnimation()
        
        console.log('Cat left the bed and woke up')
    }
}