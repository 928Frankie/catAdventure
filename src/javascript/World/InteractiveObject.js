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
        this.interactionType = options.interactionType || 'interact';
        this.hintSignModel = options.hintSignModel || 'hintSignModel';


        // Sign options (NEW)
        this.hintSignModel = options.hintSignModel || 'hintSignModel';
        this.hintSignPosition = options.hintSignPosition || new THREE.Vector3(0, 2.5, 0);
        this.hintSignScale = options.hintSignScale || new THREE.Vector3(1, 1, 1);
        this.hintSignRotation = options.hintSignRotation || new THREE.Euler(0, 0, 0);
        this.hintSignColor = options.hintSignColor || 0xffff00; // Yellow by default


        // this.hintSignModel = options.hintSignModel ;
        // this.hintSignPosition = options.hintSignPosition ;
        // this.hintSignScale = options.hintSignScale;
        // this.hintSignRotation = options.hintSignRotation;
        //this.hintSignColor = options.hintSignColor; // Yellow by default

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
        this.setupHintSign();
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
        //debug flag
        //this.triggerZone.visible = this.world.debug ? true : false
        this.triggerZone.visible = this.world.debug.showTriggerZones || false
        this.container.add(this.triggerZone)
    }
    
    setupModel() {
        // Clone the model from resources
        this.model = this.resources.items[this.modelName].scene.clone()
        
        this.model.renderOrder = 1;

        // Enable shadows
        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.renderOrder = 1;
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
    setupHintSign() {
        // Create a container for the hint sign
        this.hintSign = new THREE.Group();
        this.hintSign.renderOrder = 10; 

        // Position the hint sign above the object
        //this.hintSign.position.y = 2.5; // Adjust this value as needed
        // Set position, scale, and rotation (with defaults)
        this.hintSign.position.y = 2.5 / this.container.scale.y;

        const defaultY = 2.5 / this.container.scale.y;
    
        if (this.hintSignPosition) {
            this.hintSign.position.copy(this.hintSignPosition);
        } else {
            this.hintSign.position.set(0, defaultY, 0);
        }
        
        if (this.hintSignScale) {
            this.hintSign.scale.copy(this.hintSignScale);
        }
        
        if (this.hintSignRotation) {
            this.hintSign.rotation.copy(this.hintSignRotation);
        }
        
        // Store the original position for animation reference
        this.hintSignBaseY = this.hintSign.position.y;
        

        // If we have a hint sign model in resources, use it
        if (this.resources.items[this.hintSignModel]) {
            const hintModel = this.resources.items[this.hintSignModel].scene.clone();
            this.hintSign.add(hintModel);
        } else {
            // Create a simple placeholder hint sign
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);
            // Make it face the camera
            plane.rotation.x = -Math.PI / 2;
            this.hintSign.add(plane);
        }
        
        // Set up hint sign animation
        this.hintSignBobbing = 0;
        
        // Hide initially

        this.hintSign.visible = false;

        //debug use
        //this.hintSign.visible = true;
        this.hintSign.visible = this.world.debug.showHintSigns;
        
        console.log(`Setting up hint sign for ${this.constructor.name}:`);
        console.log(`- Position: ${JSON.stringify(this.hintSignPosition)}`);
        console.log(`- Scale: ${JSON.stringify(this.hintSignScale)}`);
        console.log(`- Rotation: ${JSON.stringify(this.hintSignRotation)}`);
        console.log(`- Model: ${this.hintSignModel}`);

        // Add to container
        this.container.add(this.hintSign);
    }
    
    showHintSign() {
        if (this.hintSign) {
            this.hintSign.visible = true;
        }
    }
    
    hideHintSign() {
        if (this.hintSign) {
            this.hintSign.visible = false;
        }
    }

    getInteractionType() {
        return this.interactionType;
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
        console.log(`Cat entered ${this.constructor.name} zone`);
        this.isActive = true;
        
        // Notify the interaction system
        if (this.world.interactionSystem) {
            this.world.interactionSystem.setActiveObject(this);
        }
    }
    
    onCatLeave() {
        console.log(`Cat left ${this.constructor.name} zone`);
        this.isActive = false;
        
        // Stop the animation if it's currently active for this object
        if (this.world.cat && 
            this.world.cat.isInSpecialAnimation && 
            this.world.cat.specialAnimationName === this.animationName) {
            this.world.cat.stopSpecialAnimation();
        }

        // Notify the interaction system
        if (this.world.interactionSystem) {
            this.world.interactionSystem.clearActiveObject(this);
}
    }
    
    interact() {
        // Start the cat's special animation for this interaction
        if (this.world.cat) {
            this.world.cat.startSpecialAnimation(this.animationName);
        }
    }
    
    // update(deltaTime) {

    //     // Animate the hint sign if visible (bobbing up and down)
    //     if (this.hintSign && this.hintSign.visible) {
    //         this.hintSignBobbing += deltaTime * 2;
    //         this.hintSign.position.y = 2.5 + Math.sin(this.hintSignBobbing) * 0.1;
    //     }
    // }

    update(deltaTime) {
        // Animate the hint sign if visible (bobbing up and down)
        if (this.hintSign && this.hintSign.visible) {
            this.hintSignBobbing += deltaTime * 2;
            // Use the stored base Y position, not a hardcoded value
            this.hintSign.position.y = this.hintSignBaseY + Math.sin(this.hintSignBobbing) * 0.1;
        }
    }
}