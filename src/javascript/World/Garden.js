// src/javascript/World/Garden.js
import * as THREE from 'three'

export default class Garden {
    constructor(world) {
        this.world = world
        this.scene = this.world.scene
        this.resources = this.world.resources

        this.setGround()
        this.setFences()
    }

    setGround() {
        // Create ground plane
        this.groundGeometry = new THREE.PlaneGeometry(50, 50)
        this.groundMaterial = new THREE.MeshStandardMaterial({ 
            map: this.resources.items.grassTexture,
            roughness: 0.8
        })
        
        this.resources.items.grassTexture.wrapS = THREE.RepeatWrapping
        this.resources.items.grassTexture.wrapT = THREE.RepeatWrapping
        this.resources.items.grassTexture.repeat.set(8, 8)
        
        this.ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial)
        this.ground.rotation.x = -Math.PI * 0.5
        this.ground.receiveShadow = true
        this.scene.add(this.ground)
    }

    setFences() {
        // Simple fence using boxes
        const fenceGeometry = new THREE.BoxGeometry(1, 0.5, 0.1)
    
        const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        
        // Create fence around the garden (four sides)
        const fenceSize = 20;
        
        // Front fence
        for(let i = -fenceSize; i <= fenceSize; i+=2) {
            const fence = new THREE.Mesh(fenceGeometry, fenceMaterial)
            fence.position.set(i, 0.25, -fenceSize)
            fence.castShadow = true
            this.scene.add(fence)
        }
        
        // Back fence
        for(let i = -fenceSize; i <= fenceSize; i+=2) {
            const fence = new THREE.Mesh(fenceGeometry, fenceMaterial)
            fence.position.set(i, 0.25, fenceSize)
            fence.castShadow = true
            this.scene.add(fence)
        }
        
        // Left fence
        for(let i = -fenceSize + 1; i <= fenceSize - 1; i+=2) {
            const fence = new THREE.Mesh(fenceGeometry, fenceMaterial)
            fence.position.set(-fenceSize, 0.25, i)
            fence.rotation.y = Math.PI * 0.5
            fence.castShadow = true
            this.scene.add(fence)
        }
        
        // Right fence
        for(let i = -fenceSize + 1; i <= fenceSize - 1; i+=2) {
            const fence = new THREE.Mesh(fenceGeometry, fenceMaterial)
            fence.position.set(fenceSize, 0.25, i)
            fence.rotation.y = Math.PI * 0.5
            fence.castShadow = true
            this.scene.add(fence)
        }
    }
}