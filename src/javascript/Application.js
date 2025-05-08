// src/javascript/Application.js
import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/index.js'
import Resources from './Resources.js'
import AudioManager from './Utils/AudioManager.js'

export default class Application {
    constructor(options) {
        // Options
        this.canvas = options.canvas

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources()
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.audioManager = new AudioManager()
        this.world = new World(this)

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })

        // Start background music once resources are loaded
        this.resources.on('ready', () => {
            this.audioManager.startBackgroundMusic()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()

         // Update audio listener position based on camera position
         if (this.audioManager && this.camera) {
            const cameraPosition = this.camera.instance.position;
            const cameraDirection = new THREE.Vector3();
            const cameraUp = new THREE.Vector3(0, 1, 0);
            
            this.camera.instance.getWorldDirection(cameraDirection);
            
            this.audioManager.updateListenerPosition(
                cameraPosition,
                {
                    fx: cameraDirection.x, 
                    fy: cameraDirection.y, 
                    fz: cameraDirection.z,
                    ux: cameraUp.x, 
                    uy: cameraUp.y, 
                    uz: cameraUp.z
                }
            );
        }
    }
}