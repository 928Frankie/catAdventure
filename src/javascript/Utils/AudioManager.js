// src/javascript/Utils/AudioManager.js
import { Howl, Howler } from 'howler';
import EventEmitter from './EventEmitter.js';

export default class AudioManager extends EventEmitter {
    constructor() {
        super();
        
        // Initialize properties
        this.sounds = {};
        this.backgroundMusic = null;
        this.isMuted = false;
        this.backgroundMusicVolume = 0.3;
        this.effectsVolume = 0.7;
        
        // Setup sounds once they're loaded
        this.setupSounds();
        
        // Set up Howler global settings
        Howler.autoSuspend = false; // Prevent automatic suspension
    }
    
    setupSounds() {
        // Background music
        this.backgroundMusic = new Howl({
            src: ['./audio/pixel-dreams-259187.mp3'],
            loop: true,
            volume: this.backgroundMusicVolume,
            autoplay: false,
            preload: true
        });
        
        // Cat movement sounds
        this.sounds.walking = new Howl({
            src: ['./audio/sand-walk-106366.mp3'],
            volume: this.effectsVolume,
            loop: true,
            autoplay: false,
            preload: true
        });
        
        // Cat interaction sounds
        this.sounds.eating = new Howl({
            src: ['./audio/cat-eating-dry-food-133130.mp3'],
            volume: this.effectsVolume,
            loop: false,
            autoplay: false,
            preload: true
        });
        
        this.sounds.drinking = new Howl({
            src: ['./audio/cat-drinking-9-fx-306175.mp3'],
            volume: this.effectsVolume,
            loop: false,
            autoplay: false,
            preload: true
        });
        
        this.sounds.sleeping = new Howl({
            src: ['./audio/cat-purr-128584.mp3'],
            volume: this.effectsVolume,
            loop: true,
            autoplay: false,
            preload: true
        });
        
/*         this.sounds.jumping = new Howl({
            src: ['./audio/cat_jump.mp3'],
            volume: this.effectsVolume,
            loop: false,
            autoplay: false,
            preload: true
        }); */
        
        this.sounds.toyInteraction = new Howl({
            src: ['./audio/dog-toy-5987.mp3'],
            volume: this.effectsVolume,
            loop: false,
            autoplay: false,
            preload: true
        });
        
        this.sounds.meow = new Howl({
            src: ['./audio/cute-cat-meow-sound-333770.mp3'],
            volume: this.effectsVolume,
            loop: false,
            autoplay: false,
            preload: true
        });
    }
    
    startBackgroundMusic() {
        if (!this.isMuted && this.backgroundMusic) {
            this.backgroundMusic.play();
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }
    
    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
    
    playSound(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            // Stop the sound if it's already playing (except for looping sounds)
            if (!this.sounds[soundName].loop() && this.sounds[soundName].playing()) {
                this.sounds[soundName].stop();
            }
            return this.sounds[soundName].play();
        }
        return null;
    }
    
    stopSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].stop();
        }
    }
    
    // Special method for looping sounds (like walking)
    playContinuousSound(soundName) {
        if (!this.isMuted && this.sounds[soundName] && !this.sounds[soundName].playing()) {
            return this.sounds[soundName].play();
        }
        return null;
    }
    
    stopContinuousSound(soundName) {
        if (this.sounds[soundName] && this.sounds[soundName].playing()) {
            this.sounds[soundName].stop();
        }
    }
    
    muteAll() {
        this.isMuted = true;
        Howler.mute(true);
    }
    
    unmuteAll() {
        this.isMuted = false;
        Howler.mute(false);
    }
    
    setBackgroundMusicVolume(volume) {
        this.backgroundMusicVolume = volume;
        if (this.backgroundMusic) {
            this.backgroundMusic.volume(volume);
        }
    }
    
    setEffectsVolume(volume) {
        this.effectsVolume = volume;
        for (const sound in this.sounds) {
            this.sounds[sound].volume(volume);
        }
    }
    
    // Method to create spatial sound with 3D positioning
    createSpatialSound(soundName, position, options = {}) {
        const defaultOptions = {
            src: [`./audio/${soundName}.mp3`],
            volume: this.effectsVolume,
            loop: false,
            autoplay: false,
            preload: true,
            // Spatial audio options
            panningModel: 'HRTF',
            distanceModel: 'inverse',
            refDistance: 1,
            maxDistance: 10000,
            rolloffFactor: 1,
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        const sound = new Howl(mergedOptions);
        
        // Set the position
        sound.pos(position.x, position.y, position.z);
        
        return sound;
    }
    
    // Update the position of the listener (usually the camera or player)
    updateListenerPosition(position, orientation) {
        Howler.pos(position.x, position.y, position.z);
        if (orientation) {
            // front x, front y, front z, up x, up y, up z
            Howler.orientation(
                orientation.fx, orientation.fy, orientation.fz,
                orientation.ux, orientation.uy, orientation.uz
            );
        }
    }
}