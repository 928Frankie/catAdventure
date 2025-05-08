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
        // Create manager for tracking progress
        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () => {
                this.checkAllLoaded()
            },
            
            // Progress
            (url, itemsLoaded, itemsTotal) => {
                if (this.loadingScreen) {
                    this.loadingScreen.updateProgress(itemsLoaded, itemsTotal)
                }
            },
            
            // Error
            (url) => {
                console.error('Error loading: ' + url)
            }
        )

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

/*     startLoading() {
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

        //food sign model
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
        
    } */

        startLoading() {
            // Count all items to load
            const resources = [
                { type: 'gltf', name: 'catModel', path: './models/orange_cat_animated.glb' },
                { type: 'texture', name: 'grassTexture', path: './textures/47056.jpg' },
                { type: 'gltf', name: 'toyModel', path: './models/item-banana.glb' },
                { type: 'gltf', name: 'waterBowlModel', path: './models/water-bowl.glb' },
                { type: 'gltf', name: 'foodBowlModel', path: './models/double-bowl.glb' },
                { type: 'gltf', name: 'bedModel', path: './models/cat-bed-icon.glb' },
                { type: 'gltf', name: 'waterSignModel', path: './models/signs/exclamation_point.glb' },
                { type: 'gltf', name: 'foodSignModel', path: './models/signs/pumping_heart_model.glb' },
                { type: 'gltf', name: 'sleepSignModel', path: './models/signs/question_3d_icon.glb' },
                // Add audio resource loading if needed
                { type: 'audio', name: 'backgroundMusic', path: './audio/pixel-dreams-259187.mp3' },
                { type: 'audio', name: 'catWalking', path: './audio/sand-walk-106366.mp3' },
                { type: 'audio', name: 'catEating', path: './audio/cat-eating-dry-food-133130.mp3' },
                { type: 'audio', name: 'catDrinking', path: './audio/cat-drinking-9-fx-306175.mp3' },
                { type: 'audio', name: 'catPurring', path: './audio/cat-purr-128584.mp3' },
                //{ type: 'audio', name: 'catJump', path: './audio/cat_jump.mp3' },
                { type: 'audio', name: 'catMeow', path: './audio/cute-cat-meow-sound-333770.mp3' },
                { type: 'audio', name: 'toyBounce', path: './audio/dog-toy-5987.mp3' }
            ]
    
            this.toLoad = resources.length
            
            if (this.loadingScreen) {
                this.loadingScreen.updateProgress(0, this.toLoad)
            }
            
            // Load each resource
            resources.forEach(resource => {
                switch(resource.type) {
                    case 'gltf':
                        this.loaders.gltfLoader.load(
                            resource.path,
                            (file) => {
                                this.items[resource.name] = file
                                this.loaded++
                                this.onProgress()
                            }
                        )
                        break
                        
                    case 'texture':
                        this.loaders.textureLoader.load(
                            resource.path,
                            (file) => {
                                this.items[resource.name] = file
                                this.loaded++
                                this.onProgress()
                            }
                        )
                        break
                        
                    case 'audio':
                        // We just track audio loading for progress, actual loading is handled by Howler
                        this.loaded++
                        this.onProgress()
                        break
                }
            })
        }

        onProgress() {
            if (this.loadingScreen) {
                this.loadingScreen.updateProgress(this.loaded, this.toLoad)
            }
            this.checkAllLoaded()
        }

    checkAllLoaded() {
        if(this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}