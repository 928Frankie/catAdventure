// src/javascript/World/InteractiveObject.js
import * as THREE from 'three'

export default class InteractiveObject {
    constructor(world, options) {
        this.world = world
        this.scene = this.world.scene
        this.resources = this.world.resources
        
        // Options
        this.modelName = options.modelName
        this.position = options.position || new THREE.Vector3(0, 0, 0)
        this.scale = options.scale || new THREE.Vector3(3, 3, 3)
        this.rotation = options.rotation || new THREE.Euler(0, 0, 0)
        this.triggerDistance = options.triggerDistance || 2
        this.animationName = options.animationName || 'idle'
        
        this.isActive = false
        
        // Create a container for the model
        this.container = new THREE.Group()
        this.container.position.copy(this.position)
        this.container.scale.copy(this.scale)
        this.container.rotation.copy(this.rotation)
        this.scene.add(this.container)
        
        // Add trigger zone (invisible sphere for proximity detection)
        this.setupTriggerZone()
        
        // Load the 3D model if specified
        if(this.modelName && this.resources.items[this.modelName]) {
            this.setupModel()
        } else {
            // Create placeholder if model not available
            this.createPlaceholder()
        }
    }
    
    setupTriggerZone() {
        // Create invisible sphere for detecting when cat is near
        this.triggerZone = new THREE.Mesh(
            new THREE.SphereGeometry(this.triggerDistance, 8, 8),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true,
                transparent: true,
                opacity: 0.1
            })
        )
        this.triggerZone.visible = this.world.debug ? true : false
        this.container.add(this.triggerZone)
    }
    
    setupModel() {
        // Clone the model from resources
        this.model = this.resources.items[this.modelName].scene.clone()
        
        // Enable shadows
        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        
        this.container.add(this.model)
    }
    
    createPlaceholder() {
        // Create simple placeholder geometry
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.5
        })
        
        this.model = new THREE.Mesh(geometry, material)
        this.container.add(this.model)
    }
    
    checkProximity(catPosition) {
        // Calculate world position of this object
        const worldPosition = new THREE.Vector3()
        this.container.getWorldPosition(worldPosition)
        
        // Calculate distance between cat and this object
        const distance = worldPosition.distanceTo(catPosition)
        
        // Check if cat is within trigger distance
        const isNear = distance < this.triggerDistance
        
        // If state changed, trigger appropriate event
        if(isNear && !this.isActive) {
            this.onCatEnter()
        } else if(!isNear && this.isActive) {
            this.onCatLeave()
        }
        
        return isNear
    }
    
    onCatEnter() {
        console.log(`Cat entered ${this.constructor.name} zone`)
        this.isActive = true
    }
    
    onCatLeave() {
        console.log(`Cat left ${this.constructor.name} zone`)
        this.isActive = false
    }
    
    update() {
        // Override in subclass if needed
    }
}