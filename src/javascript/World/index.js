// src/javascript/World/index.js
import * as THREE from 'three'
import Cat from './Cat.js'
import Garden from './Garden.js'
import Toy from './Toy.js'
import WaterBowl from './WaterBowl.js'
import FoodBowl from './FoodBowl.js'
import Bed from './Bed.js'
import InteractionSystem from './InteractionSystem.js'


export default class World {
    constructor(application) {
        this.application = application;
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        this.time = this.application.time;
        this.camera = this.application.camera;

        // Add debug flag
        this.debug = {
            showHintSigns: false,
            showTriggerZones: false,
        };
        

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup interaction system first (other objects will reference it)
            console.log('Setting up interaction system...');
            this.interactionSystem = new InteractionSystem(this);
            
            // Setup environment
            console.log('Creating garden...');
            this.garden = new Garden(this);
            
            // Create cat
            console.log('Creating cat...');
            this.cat = new Cat(this);
            
            // Create toy
            this.toy = new Toy(this);

            console.log('Creating interactive objects...');
            this.interactiveObjects = [];

            // Create water bowl
            this.waterBowl = new WaterBowl(this, {
                position: new THREE.Vector3(10, 0, 2),
                scale: new THREE.Vector3(0.3, 0.3, 0.3),

                hintSignPosition: new THREE.Vector3(0, 3.0, 0), // Higher position
                hintSignScale: new THREE.Vector3(1.5, 1.5, 1.5), // Larger scale
            });
            this.interactiveObjects.push(this.waterBowl);
            
            // Create food bowl
            this.foodBowl = new FoodBowl(this, {

                position: new THREE.Vector3(-6, 0, 2),
                scale: new THREE.Vector3(8, 8, 8),

                hintSignPosition: new THREE.Vector3(0, 0.2, 0), // Slightly forward and lower
                hintSignScale: new THREE.Vector3(0.004,0.004, 0.004), // Slightly larger
                hintSignColor: 0xff8800 // Orange color for food

            });
            this.interactiveObjects.push(this.foodBowl);
            
            // Create cat bed
            this.bed = new Bed(this, {
                position: new THREE.Vector3(0, 0, -10),
                scale: new THREE.Vector3(6, 6, 6),

                hintSignPosition: new THREE.Vector3(0, 0.4, 0), // Lower position
                hintSignScale: new THREE.Vector3(0.1, 0.1, 0.1), // Much larger
                //hintSignRotation: new THREE.Euler(-Math.PI/2, 0, Math.PI/4), // Rotated 45 degrees
                hintSignRotation: new THREE.Euler(Math.PI/2, 0, 0),
                hintSignColor: 0x9b59b6 // Purple color for sleep
            });
            this.interactiveObjects.push(this.bed);
            
            // Add ambient light
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(this.ambientLight);
            
            // Add directional light
            this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            this.directionalLight.position.set(5, 5, 5);
            this.directionalLight.castShadow = true;
            this.directionalLight.shadow.mapSize.width = 1024;
            this.directionalLight.shadow.mapSize.height = 1024;
            this.scene.add(this.directionalLight);
        });
    }

    update() {
        // Calculate delta time for animations
        const deltaTime = this.time.delta * 0.001;
        
        // Update interaction system
        if (this.interactionSystem) {
            this.interactionSystem.update();
        }
        
        // Update cat
        if (this.cat) {
            this.cat.update();
            
            // Check if cat is near any interactive objects
            if (this.interactiveObjects) {
                for (const object of this.interactiveObjects) {
                    object.checkProximity(this.cat.model.position);
                    object.update(deltaTime);
                }
            }
        }
        
        // Update toy
        if (this.toy) {
            this.toy.update();
        }
    }
}