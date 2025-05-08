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
            './textures/grass-large.png',
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

        // Load water bowl model
        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/water-bowl.glb',
            (file) => {
                this.items.waterBowlModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )
    

        // Load food bowl model
        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/double-bowl.glb',
            (file) => {
                this.items.foodBowlModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )



        // Load cat-bed model
        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/cat-bed-icon.glb',
            // Path to your bed model
            (file) => {
                this.items.bedModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )


        //load hint signs

        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/signs/exclamation_point.glb',
            
            (file) => {
                this.items.waterSignModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )

        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/signs/pumping_heart_model.glb',
            (file) => {
                this.items.foodSignModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )
        
        // Sleep hint sign
        this.toLoad++
        this.loaders.gltfLoader.load(
            './models/signs/question_3d_icon.glb',
            (file) => {
                this.items.sleepSignModel = file
                this.loaded++
                this.checkAllLoaded()
            }
        )


        // this.toLoad++
        // this.loaders.gltfLoader.load(
        //     './models/scene/fence.glb',  // Path to your bed model
        //     (file) => {
        //         this.items.fenceModel = file
        //         this.loaded++
        //         this.checkAllLoaded()
        //     }
        // )
        
    }

    checkAllLoaded() {
        if(this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}