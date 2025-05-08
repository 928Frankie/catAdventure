// src/javascript/UI/AudioControls.js
export default class AudioControls {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.setupUI();
    }
    
    setupUI() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'audio-controls';
        this.container.style.position = 'absolute';
        this.container.style.bottom = '10px';
        this.container.style.right = '10px';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.container.style.padding = '10px';
        this.container.style.borderRadius = '5px';
        this.container.style.zIndex = '1000';
        
        // Create mute button
        this.muteButton = document.createElement('button');
        this.muteButton.className = 'audio-button';
        this.muteButton.innerHTML = '🔊'; // Unicode speaker icon
        this.muteButton.style.backgroundColor = 'transparent';
        this.muteButton.style.border = 'none';
        this.muteButton.style.color = 'white';
        this.muteButton.style.fontSize = '24px';
        this.muteButton.style.cursor = 'pointer';
        this.muteButton.style.marginRight = '10px';
        
        // Create music volume slider
        this.musicVolumeContainer = document.createElement('div');
        this.musicVolumeContainer.style.display = 'flex';
        this.musicVolumeContainer.style.alignItems = 'center';
        this.musicVolumeContainer.style.marginBottom = '10px';
        
        this.musicVolumeLabel = document.createElement('span');
        this.musicVolumeLabel.textContent = '🎵'; // Unicode music note
        this.musicVolumeLabel.style.color = 'white';
        this.musicVolumeLabel.style.marginRight = '10px';
        
        this.musicVolumeSlider = document.createElement('input');
        this.musicVolumeSlider.type = 'range';
        this.musicVolumeSlider.min = '0';
        this.musicVolumeSlider.max = '1';
        this.musicVolumeSlider.step = '0.1';
        this.musicVolumeSlider.value = this.audioManager.backgroundMusicVolume;
        
        // Create effects volume slider
        this.effectsVolumeContainer = document.createElement('div');
        this.effectsVolumeContainer.style.display = 'flex';
        this.effectsVolumeContainer.style.alignItems = 'center';
        
        this.effectsVolumeLabel = document.createElement('span');
        this.effectsVolumeLabel.textContent = '🔉'; // Unicode sound icon
        this.effectsVolumeLabel.style.color = 'white';
        this.effectsVolumeLabel.style.marginRight = '10px';
        
        this.effectsVolumeSlider = document.createElement('input');
        this.effectsVolumeSlider.type = 'range';
        this.effectsVolumeSlider.min = '0';
        this.effectsVolumeSlider.max = '1';
        this.effectsVolumeSlider.step = '0.1';
        this.effectsVolumeSlider.value = this.audioManager.effectsVolume;
        
        // Add event listeners
        this.muteButton.addEventListener('click', () => {
            this.toggleMute();
        });
        
        this.musicVolumeSlider.addEventListener('input', (e) => {
            this.audioManager.setBackgroundMusicVolume(parseFloat(e.target.value));
        });
        
        this.effectsVolumeSlider.addEventListener('input', (e) => {
            this.audioManager.setEffectsVolume(parseFloat(e.target.value));
        });
        
        // Append elements
        this.musicVolumeContainer.appendChild(this.musicVolumeLabel);
        this.musicVolumeContainer.appendChild(this.musicVolumeSlider);
        
        this.effectsVolumeContainer.appendChild(this.effectsVolumeLabel);
        this.effectsVolumeContainer.appendChild(this.effectsVolumeSlider);
        
        this.container.appendChild(this.muteButton);
        this.container.appendChild(this.musicVolumeContainer);
        this.container.appendChild(this.effectsVolumeContainer);
        
        document.body.appendChild(this.container);
    }
    
    toggleMute() {
        if (this.audioManager.isMuted) {
            this.audioManager.unmuteAll();
            this.muteButton.innerHTML = '🔊';
        } else {
            this.audioManager.muteAll();
            this.muteButton.innerHTML = '🔇';
        }
    }
}