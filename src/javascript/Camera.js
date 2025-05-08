// src/javascript/Camera.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor(application) {
        this.application = application
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.canvas = this.application.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(6, 6, 6)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true

         // Restrict vertical rotation - ensure camera stays above the platform
         this.controls.minPolarAngle = 0; // Looking up limit
         this.controls.maxPolarAngle = Math.PI / 2.5; // Restrict looking down (less than horizontal)
         
         // Optional: Restrict zoom 
         this.controls.minDistance = 5; // Don't get too close
         this.controls.maxDistance = 30; // Don't go too far
         
         // Set target to follow the cat
         this.followCat = true; // You can toggle this 
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}