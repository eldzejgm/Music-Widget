class AudioWidget {
    constructor(config = {}) {
      this.config = {
        musicPath: config.musicPath || 'music/',
        initialVolume: config.initialVolume || 0.5,
        buttonClasses: config.buttonClasses || {},
        buttonIcons: config.buttonIcons || {},
        iconStyles: config.iconStyles || {},
      };
  
      this.init();
    }
  
    async init() {
      this.audioElement = document.createElement('audio');
      this.audioElement.loop = true;
      this.audioElement.volume = this.config.initialVolume;
  
      this.songs = [];
      this.currentSongIndex = 0;
      this.userInteracted = false;
  
      this.createUI();
      await this.loadSongsFromFolder();
      this.addEventListeners();
    }
  
    renderIcon(icon, id) {
        if (icon.includes('fa-')) {
          return `<i class="${icon}"></i>`;
        } else if (icon.startsWith('http') || icon.match(/\.(png|jpg|svg)$/)) {
          return `<img src="${icon}" alt="${id}" class="button-icon">`;
        } else {
          return `<i class="fas fa-question-circle"></i>`;
        }
      }
      
  
    createUI() {
        const container = document.createElement('div');
        container.classList.add('dial-container');
      
        const mainButton = this.createButton(
          'dial-main',
          this.config.buttonClasses.main || '',
          '<svg class="dial-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" /></svg>'
        );
        mainButton.id = 'audioPanelToggle';
      
        const menu = document.createElement('div');
        menu.classList.add('dial-menu');
        menu.id = 'audioPanel';
      
        const buttons = [
          { id: 'prevTrack', icon: this.config.buttonIcons.prevTrack || 'fas fa-step-backward' },
          {
            id: 'playPauseButton',
            icon: this.config.buttonIcons.playPauseButton?.play || 'fas fa-play',
            isPlayPause: true,
          },
          { id: 'stopButton', icon: this.config.buttonIcons.stopButton || 'fas fa-stop' },
          { id: 'nextTrack', icon: this.config.buttonIcons.nextTrack || 'fas fa-step-forward' },
          { id: 'volumeDown', icon: this.config.buttonIcons.volumeDown || 'fas fa-volume-down' },
          { id: 'volumeUp', icon: this.config.buttonIcons.volumeUp || 'fas fa-volume-up' },
        ];
      
        buttons.forEach(({ id, icon, isPlayPause }) => {
          const styles = this.config.iconStyles?.[id];
          const button = this.createButton(
            'dial-item',
            this.config.buttonClasses[id] || '',
            this.renderIcon(icon, id),
            undefined,
            styles
          );
          button.id = id;
      
          if (isPlayPause) {
            const iconElement = button.querySelector('img, i, svg');
            const playStyles = this.config.iconStyles?.playPauseButton?.play;
      
            if (iconElement && playStyles) {
              Object.assign(iconElement.style, playStyles);
            }
          }
      
          menu.appendChild(button);
        });
      
        container.appendChild(mainButton);
        container.appendChild(menu);
        document.body.appendChild(container);
      }
  
      createButton(baseClass, customClass, defaultIconHTML, customIcon, customStyles) {
        const button = document.createElement('button');
        const finalClass = customClass || baseClass;
        button.classList.add(finalClass);
      
        if (customIcon) {
          if (typeof customIcon === 'object' && customIcon.play) {
            button.innerHTML = customIcon.play.startsWith('http') || customIcon.play.endsWith('.png') || customIcon.play.endsWith('.jpg')
              ? `<img src="${customIcon.play}" alt="Play" class="button-icon">`
              : customIcon.play;
          } else if (customIcon.startsWith('http') || customIcon.endsWith('.png') || customIcon.endsWith('.jpg')) {
            button.innerHTML = `<img src="${customIcon}" alt="icon" class="button-icon">`;
          } else {
            button.innerHTML = customIcon;
          }
        } else {
          button.innerHTML = defaultIconHTML;
        }
      
        const iconElement = button.querySelector('img, i, svg');
        if (iconElement && customStyles) {
          Object.assign(iconElement.style, customStyles);
        }
      
        return button;
      }
  
    async loadSongsFromFolder() {
      try {
        const response = await fetch(this.config.musicPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
  
        const basePath = new URL(this.config.musicPath, window.location.href).href;
  
        this.songs = links
          .map(link => link.getAttribute('href'))
          .filter(href => href && (href.endsWith('.mp3') || href.endsWith('.wav')))
          .map(href => new URL(href, basePath).href);
  
        if (this.songs.length) {
          this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
          this.loadSong(this.currentSongIndex);
        } else {
          console.error('No audio files found in the specified folder.');
        }
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    }
  
    loadSong(index) {
      this.audioElement.src = this.songs[index];
      if (this.userInteracted) this.audioElement.play().catch(console.error);
    }
  
    addEventListeners() {
      document.addEventListener('click', () => (this.userInteracted = true));
  
      const toggleButton = document.getElementById('audioPanelToggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => {
          const menu = document.getElementById('audioPanel');
          if (menu) menu.classList.toggle('active');
        });
      }
  
      const playPauseButton = document.getElementById('playPauseButton');
      if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
          const icon = playPauseButton.querySelector('i');
      
          if (this.audioElement.paused) {
            this.audioElement.play().catch(console.error);
            if (icon) icon.className = this.config.buttonIcons.playPauseButton?.pause || 'fas fa-pause';
          } else {
            this.audioElement.pause();
            if (icon) icon.className = this.config.buttonIcons.playPauseButton?.play || 'fas fa-play';
          }
        });
      }      
  
      const stopButton = document.getElementById('stopButton');
      if (stopButton) {
        stopButton.addEventListener('click', () => {
          this.audioElement.pause();
          this.audioElement.currentTime = 0;
      
          const playPauseIcon = document.querySelector('#playPauseButton i');
          if (playPauseIcon) {
            playPauseIcon.className = this.config.buttonIcons.playPauseButton?.play || 'fas fa-play';
          }
        });
      }
      
  
      document.getElementById('prevTrack')?.addEventListener('click', () => {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
      });
  
      document.getElementById('nextTrack')?.addEventListener('click', () => {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
      });
  
      document.getElementById('volumeDown')?.addEventListener('click', () => {
        this.audioElement.volume = Math.max(0, this.audioElement.volume - 0.1);
      });
  
      document.getElementById('volumeUp')?.addEventListener('click', () => {
        this.audioElement.volume = Math.min(1, this.audioElement.volume + 0.1);
      });
    }
  }
  
  export default function initAudioWidget(config) {
    return new AudioWidget(config);
  }
  
