// src/javascript/Renderer.js
import * as THREE from 'three'

export default class Renderer {
    constructor(application) {
        this.application = application
        this.canvas = this.application.canvas
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.camera = this.application.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        //this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.outputColorSpace = THREE.SRGBColorSpace
        
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#a1e7fb')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}