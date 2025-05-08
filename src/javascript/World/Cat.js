// src/javascript/World/Cat.js
import * as THREE from 'three'
import gsap from 'gsap'

export default class Cat {
    constructor(world) {
        this.world = world
        this.scene = this.world.scene
        this.resources = this.world.resources
        this.time = this.world.time
        
        // Set up
        this.resource = this.resources.items.catModel
        
        this.setModel()
        this.setAnimation()
        this.setMovement()

        this.isInSpecialAnimation = false;
        this.specialAnimationName = null;
        this.specialAnimationStartTime = 0
        this.specialAnimationDuration = 3000 // 3 seconds in milliseconds
        this.lastMovementState = { 
            position: new THREE.Vector3(), 
            rotation: new THREE.Euler() 
        };

        this.isJumping = false

    }

    setModel() {
        this.model = this.resource.scene
        this.model.rotation.z = Math.PI;
        this.model.scale.set(5, 5, 5)
        this.model.position.y = 0.1  // Slightly above ground
        this.model.castShadow = true

        this.model.renderOrder = 1000;
        
        // Enable shadows for all meshes
        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.renderOrder = 1000;
            }
            if(child.material) {
                // Only modify depthWrite if the material has transparency
                if(child.material.transparent) {
                    child.material.transparent = true;
                    child.material.depthWrite = false;
                }
                child.material.needsUpdate = true;
            }
        })
        
        this.scene.add(this.model)
    }

    setAnimation() {


        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        console.log("Available animations:");
        this.resource.animations.forEach((clip, index) => {
            console.log(`${index}: ${clip.name}`);
        });
        
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[5])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[23])
        this.animation.actions.drinking = this.animation.mixer.clipAction(this.resource.animations[3])
        this.animation.actions.eating = this.animation.mixer.clipAction(this.resource.animations[4])
        this.animation.actions.jumping = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.sleeping = this.animation.mixer.clipAction(this.resource.animations[17])



        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()
    }

    setMovement() {
        // Keyboard controls for cat movement
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
        }
        
        window.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = true
                    break
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = true
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = true
                    break
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = true
                    break
                case 'Space':
                    this.keys.jump = true 
                    this.performJump()
                    break
            }
        })
        
        window.addEventListener('keyup', (event) => {
            switch(event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = false
                    break
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = false
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = false
                    break
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = false
                    break
                case 'Space':
                    this.keys.jump = false
                    break
            }
        })
    }

    startSpecialAnimation(animationName) {
        if(!this.animation || !this.animation.actions) {
            console.warn('No animations available for special animation: ' + animationName);
            return;
        }
        
        // Don't restart if already in this animation
        if(this.isInSpecialAnimation && this.specialAnimationName === animationName) {
            return;
        }
        
        // Save current position and rotation
        this.lastMovementState.position.copy(this.model.position);
        this.lastMovementState.rotation.copy(this.model.rotation);
        
        // Find the animation
        let action = null;
        
        if(animationName === 'sleeping') {
            // Try to find a suitable sleeping animation
            if(this.animation.actions.sleeping) {
                action = this.animation.actions.sleeping;
            } 
            // If no specific sleeping animation, you could use rest or idle
            else if(this.animation.actions.rest) {
                action = this.animation.actions.rest;
            }
            else if(this.animation.actions.idle) {
                action = this.animation.actions.idle;
                
                // Optionally: Adjust the cat model to look like it's sleeping
                // For example, rotate it to lie down
                this.model.rotation.z = Math.PI / 2;
            }
        }

        // Try exact name match first
        else if(this.animation.actions[animationName]) {
            action = this.animation.actions[animationName];
        } 
        // Try case-insensitive search
        else {
            const lowerName = animationName.toLowerCase();
            for(const name in this.animation.actions) {
                if(name.toLowerCase().includes(lowerName)) {
                    action = this.animation.actions[name];
                    break;
                }
            }
        }
        
        // If animation not found, use idle as fallback
        if(!action) {
            console.warn(`Animation '${animationName}' not found, using idle`);
            if(this.animation.actions.idle) {
                action = this.animation.actions.idle;
            } else {
                console.error('No fallback animation available');
                return;
            }
        }
        
        // Transition to the special animation
        if(this.animation.actions.current) {
            this.animation.actions.current.fadeOut(0.5);
        }
        action.reset().fadeIn(0.5).play();
        this.animation.actions.current = action;
        
        this.isInSpecialAnimation = true;
        this.specialAnimationName = animationName;
        this.specialAnimationStartTime = Date.now()
        setTimeout(() => {
            if (this.isInSpecialAnimation && this.specialAnimationName === animationName) {
                this.stopSpecialAnimation()
            }
        }, this.specialAnimationDuration)
        console.log(`Playing special animation: ${animationName}`);
    }
    
    // Method to stop special animation
    stopSpecialAnimation() {
        const currentTime = Date.now()
        const elapsedTime = currentTime - this.specialAnimationStartTime
        if (elapsedTime < this.specialAnimationDuration) {
            const remainingTime = this.specialAnimationDuration - elapsedTime
            setTimeout(() => this.stopSpecialAnimation(), remainingTime)
            return
        }

        if(!this.isInSpecialAnimation) return;
        
        this.isInSpecialAnimation = false;
        this.specialAnimationName = null;
        
        // Return to idle animation
        if(this.animation && this.animation.actions && this.animation.actions.idle) {
            this.animation.actions.current.fadeOut(0.5);
            this.animation.actions.idle.reset().fadeIn(0.5).play();
            this.animation.actions.current = this.animation.actions.idle;
        }
    }
    performJump() {
        if (this.keys.jump && !this.isJumping) {
            this.isJumping = true;
            
            // Play jumping animation
            if (this.animation && this.animation.actions && this.animation.actions.jumping) {
                this.animation.actions.current.fadeOut(0.2);
                this.animation.actions.jumping.reset().fadeIn(0.2).play();
                this.animation.actions.current = this.animation.actions.jumping;
                
                // Store original Y position
                const originalY = this.model.position.y;
                
                // Jump animation with GSAP
                gsap.to(this.model.position, {
                    y: originalY + 1.5, // Jump height
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(this.model.position, {
                            y: originalY,
                            duration: 0.4,
                            ease: "power3.in",
                            onComplete: () => {
                                this.isJumping = false;
                                
                                // Return to idle animation
                                this.animation.actions.current.fadeOut(0.2);
                                this.animation.actions.idle.reset().fadeIn(0.2).play();
                                this.animation.actions.current = this.animation.actions.idle;
                            }
                        });
                    }
                });
            }
        }
    }
    
    update() {
        // Update animations
        if(this.animation && this.animation.mixer) {
            this.animation.mixer.update(this.time.delta * 0.001);
        }
        const isAnyMovementKeyPressed = 
            this.keys.forward || 
            this.keys.backward || 
            this.keys.left || 
            this.keys.right;

        if(this.isInSpecialAnimation && isAnyMovementKeyPressed) {
            // Check if minimum animation time has elapsed
            const currentTime = Date.now()
            const elapsedTime = currentTime - this.specialAnimationStartTime
            
            // Only allow interruption if minimum time has passed
            if (elapsedTime >= this.specialAnimationDuration) {
                this.stopSpecialAnimation()
            }
        }


        if(this.isJumping || this.isInSpecialAnimation) {
            return
        }
        
        // Movement logic
        const speed = 0.03
        let isMoving = false
        
        if(this.keys.forward) {
            this.model.position.z -= speed
            this.model.rotation.y = Math.PI
            isMoving = true
        }
        
        if(this.keys.backward) {
            this.model.position.z += speed
            this.model.rotation.y = 0
            isMoving = true
        }
        
        if(this.keys.left) {
            this.model.position.x -= speed
            this.model.rotation.y = -Math.PI * 0.5
            isMoving = true
        }
        
        if(this.keys.right) {
            this.model.position.x += speed
            this.model.rotation.y = Math.PI * 0.5
            isMoving = true
        }
        
        // Change animation based on movement
        if(this.animation && 
            this.animation.actions && 
            this.animation.actions.idle && 
            this.animation.actions.walking) {
             
             // If moving and not already in walking animation
             if(isMoving && this.animation.actions.current !== this.animation.actions.walking) {
                 // Switch to walking animation with crossfade
                 this.animation.actions.current.fadeOut(0.5);
                 this.animation.actions.walking.reset().fadeIn(0.5).play();
                 this.animation.actions.current = this.animation.actions.walking;
             }
             // If not moving and not already in idle animation
             else if(!isMoving && this.animation.actions.current !== this.animation.actions.idle) {
                 // Switch back to idle animation with crossfade
                 this.animation.actions.current.fadeOut(0.5);
                 this.animation.actions.idle.reset().fadeIn(0.5).play();
                 this.animation.actions.current = this.animation.actions.idle;
             }
        }
    }
}