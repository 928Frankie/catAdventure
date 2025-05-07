// src/javascript/Resources.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Resources extends EventEmitter {
    constructor() {
        super()

        this.items = {}
        this.toLoad = 0
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        
        // Add error handling to GLTF loader
        this.loaders.gltfLoader.manager.onError = (url) => {
            console.log('Error loading GLTF from', url)
            // Count it as loaded anyway to prevent hanging
            this.loaded++
            this.checkAllLoaded()
        }
    }

    startLoading() {
        // Load cat model
        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/orange_cat_animated.glb',
            (file) => {
                this.items.catModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )

         // Load grass texture
        this.toLoad++
        this.loaders.textureLoader.load(
            './textures/47056.jpg',
            (file) => {
                this.items.grassTexture = file
                this.loaded++
                this.checkAllLoaded()
            }
        )

        //Load toy model
        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/item-banana.glb',
            (file) => {
                this.items.toyModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )

        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/pet-bowl.glb',
            (file) => {
                this.items.waterBowlModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )
    

        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/bowl.glb',
            (file) => {
                this.items.foodBowlModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )
        // Load food bowl model
    }

    checkAllLoaded() {
        if(this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}