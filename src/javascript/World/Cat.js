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

        // Initialize target movement properties
        this.isMovingToTarget = false
        this.targetPosition = null
        this.pendingInteractionType = null
        
        this.setModel()
        this.setAnimation()
        this.setMovement()

        this.isInSpecialAnimation = false;
        this.specialAnimationName = null;

        this.specialAnimationTimeoutId = null;
        //this.specialAnimationStartTime = 0
        //this.specialAnimationDuration = 3000 // 3 seconds in milliseconds
        this.lastMovementState = { 
            position: new THREE.Vector3(), 
            rotation: new THREE.Euler() 
        };

        //this.isJumping = false

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
    // Helper method to find animation by name
    findAnimationByName(name) {
        const lowerName = name.toLowerCase();
        return this.resource.animations.find(clip => 
            clip.name.toLowerCase().includes(lowerName)
        );
    }

    setMovement() {
        // Keyboard controls for cat movement
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            interact: false,
        }
        
        /* window.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = true
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = true
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = true
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = true
                    break;
                case 'Space':
                    this.keys.jump = true 
                    this.performJump()
                    break;
                case 'KeyX':
                    this.keys.interact = true;
                    break;
                }
        }) */

                window.addEventListener('keydown', (event) => {
                    switch(event.code) {
                        case 'ArrowUp':
                        case 'KeyW':
                            this.keys.forward = true;
                            // Exit sleep animation if we're in it
                            if (this.isInSpecialAnimation && this.specialAnimationName === 'sleeping') {
                                this.stopSpecialAnimation();
                            }
                            break;
                        case 'ArrowDown':
                        case 'KeyS':
                            this.keys.backward = true;
                            // Exit sleep animation if we're in it
                            if (this.isInSpecialAnimation && this.specialAnimationName === 'sleeping') {
                                this.stopSpecialAnimation();
                            }
                            break;
                        case 'ArrowLeft':
                        case 'KeyA':
                            this.keys.left = true;
                            // Exit sleep animation if we're in it
                            if (this.isInSpecialAnimation && this.specialAnimationName === 'sleeping') {
                                this.stopSpecialAnimation();
                            }
                            break;
                        case 'ArrowRight':
                        case 'KeyD':
                            this.keys.right = true;
                            // Exit sleep animation if we're in it
                            if (this.isInSpecialAnimation && this.specialAnimationName === 'sleeping') {
                                this.stopSpecialAnimation();
                            }
                            break;
                        case 'Space':
                            this.keys.jump = true;
                            // Exit sleep animation if we're in it
                            if (this.isInSpecialAnimation && this.specialAnimationName === 'sleeping') {
                                this.stopSpecialAnimation();
                            }
                            break;
                        case 'KeyX':
                            this.keys.interact = true;
                            break;
                    }
                });
        
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
                    break;
                case 'KeyX':
                    this.keys.interact = false;
                    break;
            }
        })
    }

    moveToTarget(targetPosition, interactionType) {
        // Store the target position
        this.targetPosition = targetPosition.clone();
        
        // Remember the interaction type for when we reach the target
        this.pendingInteractionType = interactionType || null;
        
        // Set a flag indicating we're moving to a target
        this.isMovingToTarget = true;
        
        // Exit any special animation if we're in one
        if (this.isInSpecialAnimation) {
            this.stopSpecialAnimation();
        }
        
        // Start the walking animation
        if (this.animation && this.animation.actions) {
            this.animation.actions.current.fadeOut(0.5);
            this.animation.actions.walking.reset().fadeIn(0.5).play();
            this.animation.actions.current = this.animation.actions.walking;
        }
        
        // Play walking sound
        if (this.world.application.audioManager) {
            this.world.application.audioManager.playContinuousSound('walking');
        }
        
        console.log("Cat is moving to target:", targetPosition);
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

        // Cancel any existing animation timeout
        if(this.specialAnimationTimeoutId) {
            clearTimeout(this.specialAnimationTimeoutId);
            this.specialAnimationTimeoutId = null;
        }
        
        // Save current position and rotation
        this.lastMovementState.position.copy(this.model.position);
        this.lastMovementState.rotation.copy(this.model.rotation);
        
        // Find the animation
        let action = null;
        
        if(this.animation.actions[animationName]) {
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

        console.log(`Playing special animation: ${animationName}`);


        // Play the corresponding sound effect
    if (this.world.application.audioManager) {
        // Stop walking sound first
        this.world.application.audioManager.stopContinuousSound('walking');
        
        // Play the appropriate sound based on the animation
        switch (animationName) {
            case 'eating':
                this.world.application.audioManager.playSound('eating');
                break;
            case 'drinking':
                this.world.application.audioManager.playSound('drinking');
                break;
            case 'sleeping':
                this.world.application.audioManager.playContinuousSound('sleeping');
                break;
            case 'jumping':
                this.world.application.audioManager.playSound('jumping');
                break;
            default:
                // Random meow sound for other animations
                if (Math.random() > 0.7) { // 30% chance to meow
                    this.world.application.audioManager.playSound('meow');
                }
                break;
        }
    }



        
        this.specialAnimationStartTime = Date.now()
        // For sleeping animation, we'll keep it going until interaction happens
        if (animationName !== 'sleeping') {
            // Auto-exit the animation after a certain time (unless it's sleeping)
            this.specialAnimationTimeoutId = setTimeout(() => {
                this.stopSpecialAnimation();
            }, 5000); // 5 seconds for eating/drinking animations
        }
    }


    // Method to check if any movement key is pressed
    isMovementKeyPressed() {
        return this.keys.forward || this.keys.backward || this.keys.left || this.keys.right || this.keys.jump;
    }
    
    // Method to stop special animation
    stopSpecialAnimation() {
        if(!this.isInSpecialAnimation) return;
        
        // Clear any pending timeout
        if(this.specialAnimationTimeoutId) {
            clearTimeout(this.specialAnimationTimeoutId);
            this.specialAnimationTimeoutId = null;
        }

        // Stop the sound associated with the special animation
    if (this.world.application.audioManager && this.specialAnimationName) {
        if (this.specialAnimationName === 'sleeping') {
            this.world.application.audioManager.stopContinuousSound('sleeping');
        } else {
            this.world.application.audioManager.stopSound(this.specialAnimationName);
        }
    }


        
        this.isInSpecialAnimation = false;
        this.specialAnimationName = null;
        
        // Return to idle animation
        if(this.animation && this.animation.actions && this.animation.actions.idle) {
            this.animation.actions.current.fadeOut(0.5);
            this.animation.actions.idle.reset().fadeIn(0.5).play();
            this.animation.actions.current = this.animation.actions.idle;
        }
    }
    
 /*    performJump() {
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
    } */
    
    update() {
        // Update animations
        if(this.animation && this.animation.mixer) {
            this.animation.mixer.update(this.time.delta * 0.001);
        }

                // Handle autonomous movement to target
                if (this.isMovingToTarget && this.targetPosition) {
                    // Calculate direction to target
                    const direction = new THREE.Vector3();
                    direction.subVectors(this.targetPosition, this.model.position);
                    
                    // Normalize for consistent speed (but only if distance is significant)
                    const distanceToTarget = this.model.position.distanceTo(this.targetPosition);
                    
                    // If we're close enough to the target, stop moving and perform the interaction
                    if (distanceToTarget < 1.0) {  // Threshold to consider "arrived"
                        this.isMovingToTarget = false;
                        this.targetPosition = null;
                        
                        // Stop walking sound
                        if (this.world.application.audioManager) {
                            this.world.application.audioManager.stopContinuousSound('walking');
                        }
                        
                        // If there's a pending interaction, perform it
                        if (this.pendingInteractionType) {
                            this.startSpecialAnimation(this.pendingInteractionType);
                            this.pendingInteractionType = null;
                        } else {
                            // Switch to idle animation if no pending interaction
                            if (!this.isInSpecialAnimation && this.animation && this.animation.actions) {
                                this.animation.actions.current.fadeOut(0.5);
                                this.animation.actions.idle.reset().fadeIn(0.5).play();
                                this.animation.actions.current = this.animation.actions.idle;
                            }
                        }
                        
                        return;
                    }
                    
                    // Only normalize if we're not already very close
                    direction.normalize();
                    
                    // Move towards the target
                    const speed = 0.06; // Same speed as keyboard movement
                    this.model.position.x += direction.x * speed;
                    this.model.position.z += direction.z * speed;
                    
                    // Rotate cat to face the direction of movement
                    this.model.rotation.y = Math.atan2(direction.x, direction.z);
                    
                    // Return to skip keyboard controls while in autonomous movement
                    return;
                }
        

        if (this.isInSpecialAnimation && this.specialAnimationName === 'sleeping' && this.isMovementKeyPressed()) {
            this.stopSpecialAnimation();
        }
        
        // Skip movement logic if in special animation (except sleeping that we just handled)
        if (this.isInSpecialAnimation) {
            return;
        }

        
        // Movement logic
        const speed = 0.06
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

        if(this.keys.jump && this.animation.actions.jumping) {
            // Only start jumping if not already in jumping animation
            if(this.animation.actions.current !== this.animation.actions.jumping) {
                this.animation.actions.current.fadeOut(0.2);
                this.animation.actions.jumping.reset().fadeIn(0.2).play();
                this.animation.actions.current = this.animation.actions.jumping;
                
                // Jump effect
                gsap.to(this.model.position, {
                    y: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(this.model.position, {
                            y: 0.1,
                            duration: 0.3,
                            ease: "power2.in",
                            onComplete: () => {
                                // Go back to idle or walking
                                if(isMoving) {
                                    this.animation.actions.current.fadeOut(0.2);
                                    this.animation.actions.walking.reset().fadeIn(0.2).play();
                                    this.animation.actions.current = this.animation.actions.walking;
                                } else {
                                    this.animation.actions.current.fadeOut(0.2);
                                    this.animation.actions.idle.reset().fadeIn(0.2).play();
                                    this.animation.actions.current = this.animation.actions.idle;
                                }
                            }
                        });
                    }
                });
            }
            
            // Don't do any other animation changes
            return;
        }
        
        // Change animation based on movement
/*         if(this.animation && 
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
        } */

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
                     
                     // Play walking sound
                     if (this.world.application.audioManager) {
                         this.world.application.audioManager.playContinuousSound('walking');
                     }
                 }
                 // If not moving and not already in idle animation
                 else if(!isMoving && this.animation.actions.current !== this.animation.actions.idle) {
                     // Switch back to idle animation with crossfade
                     this.animation.actions.current.fadeOut(0.5);
                     this.animation.actions.idle.reset().fadeIn(0.5).play();
                     this.animation.actions.current = this.animation.actions.idle;
                     
                     // Stop walking sound
                     if (this.world.application.audioManager) {
                         this.world.application.audioManager.stopContinuousSound('walking');
                     }
                 }
            }
    }
}