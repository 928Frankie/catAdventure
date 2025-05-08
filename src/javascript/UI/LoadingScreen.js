// src/javascript/UI/LoadingScreen.js
export default class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
        this.createPawPrints();
        this.tipIndex = 0;
        this.tips = [
            "Use WASD or arrow keys to move the cat around",
            "Press SPACE to make the cat jump",
            "Press X when near objects to interact with them",
            "The cat can drink water, eat food, and sleep in its bed",
            "Try clicking on toys to see the cat's reactions",
            "Adjust music and sound effects using controls in the corner"
        ];
        
        this.showRandomTip();
        this.tipInterval = setInterval(() => this.showRandomTip(), 5000);
    }
    
    createLoadingScreen() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'loading-screen';
        
        // Create content container
        this.content = document.createElement('div');
        this.content.className = 'loading-screen-content';
        
        // Title
        this.title = document.createElement('h1');
        this.title.className = 'loading-title';
        this.title.textContent = 'Cat Adventures 3D';
        
        // Subtitle
        this.subtitle = document.createElement('p');
        this.subtitle.className = 'loading-subtitle';
        this.subtitle.textContent = 'Get ready to explore the world as a happy cat!';
        
        // Cat silhouette
        this.catSilhouette = document.createElement('div');
        this.catSilhouette.className = 'cat-silhouette';
        
        // Loading bar container
        this.loadingBarContainer = document.createElement('div');
        this.loadingBarContainer.className = 'loading-bar-container';
        
        // Loading bar
        this.loadingBar = document.createElement('div');
        this.loadingBar.className = 'loading-bar';
        this.loadingBarContainer.appendChild(this.loadingBar);
        
        // Loading text
        this.loadingText = document.createElement('div');
        this.loadingText.className = 'loading-text';
        this.loadingText.textContent = 'Loading resources... 0%';
        
        // Loading tips
        this.tipsElement = document.createElement('div');
        this.tipsElement.className = 'loading-tips';
        
        // Append all elements
        this.content.appendChild(this.title);
        this.content.appendChild(this.subtitle);
        this.content.appendChild(this.catSilhouette);
        this.content.appendChild(this.loadingBarContainer);
        this.content.appendChild(this.loadingText);
        this.content.appendChild(this.tipsElement);
        
        this.container.appendChild(this.content);
        document.body.appendChild(this.container);
    }
    
    createPawPrints() {
        // Create 15 random paw prints around the screen
        for (let i = 0; i < 15; i++) {
            const pawPrint = document.createElement('div');
            pawPrint.className = 'paw-print';
            
            // Random position
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            pawPrint.style.left = `${randomX}%`;
            pawPrint.style.top = `${randomY}%`;
            
            // Random rotation
            const randomRotation = Math.random() * 360;
            pawPrint.style.transform = `rotate(${randomRotation}deg)`;
            
            // Random size
            const randomSize = 0.7 + Math.random() * 0.6;
            pawPrint.style.scale = randomSize;
            
            // Random opacity
            const randomOpacity = 0.3 + Math.random() * 0.4;
            pawPrint.style.opacity = randomOpacity;
            
            this.container.appendChild(pawPrint);
        }
    }
    
    updateProgress(loaded, total) {
        const progress = Math.min(Math.floor((loaded / total) * 100), 100);
        this.loadingBar.style.width = `${progress}%`;
        this.loadingText.textContent = `Loading resources... ${progress}%`;
    }
    
    showRandomTip() {
        this.tipIndex = (this.tipIndex + 1) % this.tips.length;
        
        // Fade out
        this.tipsElement.style.opacity = '0';
        
        // Wait for fade out, then change text and fade in
        setTimeout(() => {
            this.tipsElement.textContent = this.tips[this.tipIndex];
            this.tipsElement.style.opacity = '1';
        }, 300);
    }
    
    hide() {
        clearInterval(this.tipInterval);
        this.container.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }, 500); // Should match the CSS transition time
    }
}