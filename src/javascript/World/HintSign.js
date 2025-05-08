import * as THREE from 'three'

export default class HintSign{
    constructor(resources, type) {
        this.resources = resources;
        this.type = type || 'generic';
        
        // Create container
        this.container = new THREE.Group();
        
        // Try to load the appropriate model
        const modelName = `${this.type}SignModel`;
        
        if (this.resources.items[modelName]) {
            this.setupModel(this.resources.items[modelName]);
        } else {
            this.createDefaultSign();
        }
        
        // Initialize animation properties
        this.animation = {
            time: 0,
            speed: 1
        };
        
        // Hide by default
        this.container.visible = false;
    }


    setupModel(resource) {
        // Clone the model
        this.model = resource.scene.clone();
        
        // Setup animation if available
        if (resource.animations && resource.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            this.action = this.mixer.clipAction(resource.animations[0]);
            this.action.play();
        }
        
        this.container.add(this.model);
    }


    //if create default flat icon

    show() {
        this.container.visible = true;
    }
    
    hide() {
        this.container.visible = false;
    }
    
    update(deltaTime, camera) {
        // Update animation time
        this.animation.time += deltaTime;
        
        // Bobbing animation
        if (this.container.visible) {
            this.container.position.y = Math.sin(this.animation.time * 2) * 0.1;
        }
        
        // Update mixer if it exists
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Make it face the camera (billboard effect)
        if (camera && this.container.visible) {
            this.container.lookAt(camera.position);
        }
    }

}