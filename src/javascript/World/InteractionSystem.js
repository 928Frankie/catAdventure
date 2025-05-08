// src/javascript/World/InteractionSystem.js
import * as THREE from 'three'

export default class InteractionSystem {
    constructor(world) {
        this.world = world;
        this.scene = this.world.scene;
        this.resources = this.world.resources;
        
        // Currently active interactive object
        this.activeObject = null;
        
        // UI elements
        this.setupUI();
        
        // Keyboard interaction
        this.setupKeyboard();
    }
    
    setupUI() {
        // Create UI container for interaction prompt
        this.uiContainer = document.createElement('div');
        this.uiContainer.className = 'interaction-prompt';
        this.uiContainer.style.position = 'absolute';
        this.uiContainer.style.bottom = '20px';
        this.uiContainer.style.left = '50%';
        this.uiContainer.style.transform = 'translateX(-50%)';
        this.uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.uiContainer.style.color = 'white';
        this.uiContainer.style.padding = '10px 20px';
        this.uiContainer.style.borderRadius = '5px';
        this.uiContainer.style.fontFamily = 'Arial, sans-serif';
        this.uiContainer.style.display = 'none';
        this.uiContainer.style.zIndex = '1000';
        
        document.body.appendChild(this.uiContainer);
    }
    
    setupKeyboard() {
        // Listen for 'X' key to trigger interaction
        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyX' && this.activeObject) {
                this.triggerInteraction();
            }
        });
    }
    
    setActiveObject(interactiveObject) {
        // If we already have this active object, do nothing
        if (this.activeObject === interactiveObject) return;
        
        // Deactivate previous object if it exists
        if (this.activeObject) {
            this.hideInteractionPrompt();
            this.activeObject.hideHintSign();
        }
        
        // Set new active object
        this.activeObject = interactiveObject;
        
        // Show interaction UI and hint sign for new object
        if (interactiveObject) {
            this.showInteractionPrompt(interactiveObject.getInteractionType());
            interactiveObject.showHintSign();
        }
    }
    
    clearActiveObject(interactiveObject) {
        // Only clear if this is the active object
        if (this.activeObject === interactiveObject) {
            this.hideInteractionPrompt();
            interactiveObject.hideHintSign();
            this.activeObject = null;
        }
    }
    
    showInteractionPrompt(interactionType) {
        // Update text based on interaction type
        this.uiContainer.textContent = `Press X to ${interactionType}`;
        this.uiContainer.style.display = 'block';
    }
    
    hideInteractionPrompt() {
        this.uiContainer.style.display = 'none';
    }
    
    triggerInteraction() {
        if (this.activeObject) {
            this.activeObject.interact();
        }
    }
    
    update() {
        // Update any animations or visual effects for the interaction system
    }
}