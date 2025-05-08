// src/javascript/World/Toy.js
import * as THREE from 'three'
import gsap from 'gsap'

export default class Toy {
    constructor(world) {
        this.world = world
        this.scene = this.world.scene
        this.resources = this.world.resources
        
        // Set up
        this.resource = this.resources.items.toyModel
        
        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(5, 5, 5)
        this.model.position.set(3, 0, 2)
        this.model.castShadow = true
        
        // Create interaction area (invisible sphere)
        this.interactionGeometry = new THREE.SphereGeometry(1, 16, 16)
        this.interactionMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            wireframe: false
        })
        this.interactionSphere = new THREE.Mesh(
            this.interactionGeometry,
            this.interactionMaterial
        )
        this.interactionSphere.position.copy(this.model.position)
        
        this.scene.add(this.model)
        this.scene.add(this.interactionSphere)
        
        // Add click event listener
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        
        window.addEventListener('click', (event) => {
            // Calculate mouse position in normalized device coordinates
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
            
            // Update the raycaster
            this.raycaster.setFromCamera(this.mouse, this.world.application.camera.instance)
            
            // Check for intersections
            const intersects = this.raycaster.intersectObject(this.interactionSphere)
            
            if(intersects.length > 0) {
                this.playAnimation()
            }
        })

        
    }

    setAnimation() {
        // Simple bounce animation
        this.isAnimating = false
    }

/*     playAnimation() {
        if(!this.isAnimating) {
            this.isAnimating = true

                    // Play toy interaction sound
        if (this.world.application.audioManager) {
            this.world.application.audioManager.playSound('toyInteraction');
        }
        
            
            // Bounce animation
            gsap.to(this.model.position, {
                y: 1,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(this.model.position, {
                        y: 0,
                        duration: 0.5,
                        ease: "bounce.out",
                        onComplete: () => {
                            this.isAnimating = false
                        }
                    })
                }
            })
            
            // Spin animation
            gsap.to(this.model.rotation, {
                y: this.model.rotation.y + Math.PI * 2,
                duration: 1,
                ease: "power2.inOut"
            })
        }
    } */


         playAnimation() {
        if(!this.isAnimating) {
            this.isAnimating = true

            // Play toy interaction sound
            if (this.world.application.audioManager) {
                this.world.application.audioManager.playSound('toyInteraction');
            }

            // Signal the cat to come to the toy
            if (this.world.cat) {
                // Call the cat to come to the toy
                //this.world.cat.moveToTarget(this.model.position, 'jumping');
                this.world.cat.moveToTarget(this.model.position, 'meerkating');
                console.log("Calling cat to play with toy");
            }
            
            // Bounce animation
            gsap.to(this.model.position, {
                y: 1,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(this.model.position, {
                        y: 0,
                        duration: 0.5,
                        ease: "bounce.out",
                        onComplete: () => {
                            this.isAnimating = false
                        }
                    })
                }
            })
            
            // Spin animation
            gsap.to(this.model.rotation, {
                y: this.model.rotation.y + Math.PI * 2,
                duration: 1,
                ease: "power2.inOut"
            })
        }
    }

    update() {
        // Update the interaction sphere position to match the toy
        this.interactionSphere.position.copy(this.model.position)
    }
}