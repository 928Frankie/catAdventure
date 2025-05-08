// src/javascript/World/index.js
import * as THREE from 'three'
import Cat from './Cat.js'
import Garden from './Garden.js'
import Toy from './Toy.js'
import WaterBowl from './WaterBowl.js'
import FoodBowl from './FoodBowl.js'
import Bed from './Bed.js'


export default class World {
    constructor(application) {
        this.application = application
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            console.log('Creating garden...')
            this.garden = new Garden(this)
            
            console.log('Creating cat...')
            this.cat = new Cat(this)
            
            this.toy = new Toy(this)

            console.log('Creating interactive objects...')
            this.interactiveObjects = []

            this.waterBowl = new WaterBowl(this, {
                position: new THREE.Vector3(10, 0, 2),
                scale: new THREE.Vector3(0.3, 0.3, 0.3)
            
            })
            this.interactiveObjects.push(this.waterBowl)
            
            // Create food bowl
            this.foodBowl = new FoodBowl(this, {
                position: new THREE.Vector3(-3, 0, 2),
                scale: new THREE.Vector3(8, 8, 8)
            })
            this.interactiveObjects.push(this.foodBowl)

            //create new Bed
            this.bed = new Bed(this, {
                position: new THREE.Vector3(10, 0, 10),  // Positioning the bed
                scale: new THREE.Vector3(5, 5, 5),
                rotation: new THREE.Euler(0, Math.PI / 2, 0),  // Rotate it if needed
                triggerDistance: 2.5  // Adjust as needed
            })
            this.interactiveObjects.push(this.bed)

            
            // Add ambient light
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            this.scene.add(this.ambientLight)
            
            // Add directional light
            this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            this.directionalLight.position.set(5, 5, 5)
            this.directionalLight.castShadow = true
            this.directionalLight.shadow.mapSize.width = 1024
            this.directionalLight.shadow.mapSize.height = 1024
            this.scene.add(this.directionalLight)
        })
    }

    update() {
        if(this.cat) {
            this.cat.update()
            
            // Check if cat is near any interactive objects
            if(this.interactiveObjects) {
                for(const object of this.interactiveObjects) {
                    object.checkProximity(this.cat.model.position)
                    object.update()
                }
            }
        }
        if(this.toy) this.toy.update()
    }
}