const hudTemplate = document.createElement('template');
hudTemplate.innerHTML = `
  <style>
    .hud-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
      max-width: 80vw;
      font-size: 1.25rem;
      background-color: var(--secondary-bg);
      padding: 0px 20px;
    }
    
    .neocities-logo {
      display: flex;
      align-items: center;
    }
    
    .neocities-logo img {
      height: 40px;
      margin-bottom: -6px;
    }

    .hover-move {
      transform: translate(0, 0);
      transition: transform 0.05s;
    }
    
    .hover-move:hover {
      transform: translate(4px, 4px);
    }

    .shadow {
      box-shadow: 8px 8px 2px 0px var(--shadow);
    }
    
    @media (max-height: 600px) {
      .neocities-logo img {
        height: 20px;
        margin-bottom: -5px;
      }
    }
  </style>

  <section class="hud-bar shadow hover-move">
    <slot name="left"></slot>
    <slot name="center"></slot>
    <slot name="right"></slot>
  </section>
`;

class HudBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(hudTemplate.content.cloneNode(true));
  }

  connectedCallback() {
  }
}

customElements.define('hud-bar', HudBar);

if (!Date.prototype.getWeek) {
  Date.prototype.getWeek = function() {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };
}

const onAirLightTemplate = document.createElement('template');
onAirLightTemplate.innerHTML = `
  <style>
    :host {
      font-weight: normal;
      font-size: 1.5rem;
      margin-left: auto;
      display: block;
    }
    
    :host(.on) .on-air-light {
      font-weight: bold;
      text-shadow: var(--accent-fg) 0 0 12px;
    }
    
    .on-air-light {
      padding: 8px;
      background-color: var(--accent-bg);
      color: var(--accent-fg);
      border-radius: 3px;
    }
    
    .on-air-not {
      font-size: 1.25rem;
    }

    a {
      outline: none;
      border: none;
      text-decoration: none;
      cursor: url("../img/pointer.png"), auto;
    }
    
    @media (max-height: 600px) {
      :host {
        font-size: 1.25rem;
      }
      
      .on-air-light {
        padding: 4px;
      }
      
      .on-air-not {
        font-size: 1rem;
      }
    }
  </style>

  <span class="on-air-not"></span>
  <a class="no-style on-air-link" href="https://www.wmpg.org/show/sun2300/" target="_blank">
    <span class="on-air-light">On Air</span>
  </a>
`;

class OnAirLight extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(onAirLightTemplate.content.cloneNode(true));

    this.notText = this.shadowRoot.querySelector('.on-air-not');
    this.light = this.shadowRoot.querySelector('.on-air-light');
    this.link = this.shadowRoot.querySelector('.on-air-link');

    this.playingMessage = `<span class='emoji'>s</span> Listen Live! <span class='emoji'>s</span>`;
    this.offAirMessage = `<span class='emoji'>t</span> Download My Archives! <span class='emoji'>t</span>`

    this.playingMessage += `<div class="arrow" data-popper-arrow></div>`
    this.offAirMessage += `<div class="arrow" data-popper-arrow></div>`
  }

  connectedCallback() {
    this.tooltip = document.getElementById(this.dataset.tooltipId);
    createTooltip(this.light, this.tooltip);

    this.checkTime();
  }

  disconnectedCallback() {
    if (this.timeCheckTimer) {
      clearTimeout(this.timeCheckTimer);
    }
  }
  checkTime() {
    const today = new Date();
    const isSunday = today.getDay() === 0;
    const isMonday = today.getDay() === 1;
    const rightWeek = today.getWeek() % 2 !== 0;
    const rightTimeSunday = today.getHours() === 23;
    const rightTimeMonday = today.getHours() <= 1;

    const isOnAir = (rightWeek && isSunday && rightTimeSunday) ||
      (!rightWeek && isMonday && rightTimeMonday);

    if (isOnAir) {
      this.notText.textContent = "";
      this.classList.add("on");
      this.tooltip.innerHTML = this.playingMessage;
    } else {
      this.notText.textContent = "(not)";
      this.classList.remove("on");
      this.tooltip.innerHTML = this.offAirMessage;
    }

    this.timeCheckTimer = setTimeout(() => this.checkTime(), 60000);
  }
}

customElements.define('on-air-light', OnAirLight);

const mediaPlayerTemplate = document.createElement('template');
mediaPlayerTemplate.innerHTML = `
  <style>
    :host {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
    }
    
    .transport {
      height: fit-content;
      background-color: var(--accent-bg);
      padding: 6px;
      border-radius: 3px;
      font-size: 1rem;
      display: flex;
      gap: 10px;
    }
    
    .transport img {
      width: 100%;
      height: 24px;
      transform: translateY(2px);
      cursor: url('../img/pointer.png'), auto;
    }
    
    .play-button .play-state {
      display: none;
      margin-bottom: 4px;
    }
    
    .play-button.paused .play-state {
      display: block;
    }
    
    .play-button.paused .pause-state {
      display: none;
    }
    
    .play-button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .random-button .on-state { 
      display: none;
    }
    
    .random-button.on .on-state {
      display: block;
    }
    
    .random-button.on .off-state {
      display: none;
    }
    
    .waveform {
      flex-grow: 1;
      max-height: 60px;
      cursor: url("../img/pointer.png"), auto;
    }
    
    .waveform ::part(cursor) {
      display: none;
    }
  </style>

  <div class="transport">
    <span class="play-button paused" role="button" tabindex="0" aria-label="Play/Pause">
      <img src="/img/transport/play.png" class="play-state" alt="Play"/>
      <img src="/img/transport/pause.png" class="pause-state" alt="Pause"/>
    </span>
    <span class="random-button" role="button" tabindex="0" aria-label="Random">
      <img src="/img/transport/random-on.png" class="on-state" alt="Random on"/>
      <img src="/img/transport/random-off.png" class="off-state" alt="Random off"/>
    </span>
  </div>
  <div class="waveform"></div>
`;

class MediaPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(mediaPlayerTemplate.content.cloneNode(true));

    this.playButton = this.shadowRoot.querySelector('.play-button');
    this.randomButton = this.shadowRoot.querySelector('.random-button');
    this.waveform = this.shadowRoot.querySelector('.waveform');

    this.isPlaying = false;
    this.isRandom = false;
    this.wavesurfer = null;
    this.currentSong = null;

    this.songs = [
      {
        url: 'https://file.garden/aX1-zQTMcUHpUpsD/neocities/malixus.wav',
        name: "Malixus"
      }
    ];
  }

  connectedCallback() {
    this.playButton.addEventListener('click', () => this.togglePlay());
    this.randomButton.addEventListener('click', () => this.toggleRandom());

    // Initialize WaveSurfer
    this.initializeWaveSurfer();

    // Setup beforeunload handler
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    this.tooltip = document.getElementById(this.dataset.tooltipId);

    createTooltip(this.waveform, this.tooltip, "top");
  }

  disconnectedCallback() {
    // Cleanup
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  initializeWaveSurfer() {
    if (typeof WaveSurfer === 'undefined') {
      console.error('WaveSurfer not loaded');
      return;
    }

    this.wavesurfer = WaveSurfer.create({
      container: this.waveform,
      waveColor: '#6b9466',
      progressColor: '#f5b0e1',
      barWidth: 6,
      barGap: 1,
      barRadius: 2,
      cursorWidth: 6,
      dragToSeek: true,
      responsive: true,
      height: 'auto'
    });

    // WaveSurfer event listeners
    this.wavesurfer.on('load', () => {
      this.playButton.setAttribute('disabled', 'true');
    });

    this.wavesurfer.on('ready', () => {
      this.playButton.removeAttribute('disabled');
      this.tooltip.innerHTML = `Playing "${this.currentSong.name}"<div class="arrow" data-popper-arrow></div>`;

      if (this.isRandom) {
        this.wavesurfer.play();
        this.isPlaying = true;
        this.playButton.classList.remove('paused');
      }
    });

    this.wavesurfer.on('play', () => {
      this.isPlaying = true;
      this.playButton.classList.remove('paused');
    });

    this.wavesurfer.on('pause', () => {
      this.isPlaying = false;
      this.playButton.classList.add('paused');
    });

    this.wavesurfer.on('finish', () => {
      if (this.isRandom) {
        this.currentSong = this.randomSong();
        this.wavesurfer.load(this.currentSong.url);
      } else {
        this.isPlaying = false;
        this.playButton.classList.add('paused');
      }
    });

    // Load initial song
    this.currentSong = this.randomSong();
    this.wavesurfer.load(this.currentSong.url);
  }

  togglePlay() {
    if (this.wavesurfer && !this.playButton.hasAttribute('disabled')) {
      this.wavesurfer.playPause();

      this.dispatchEvent(new CustomEvent('play-toggle', {
        detail: { playing: this.wavesurfer.isPlaying() },
        bubbles: true,
        composed: true
      }));
    }
  }

  toggleRandom() {
    this.isRandom = !this.isRandom;
    this.randomButton.classList.toggle('on', this.isRandom);

    this.dispatchEvent(new CustomEvent('random-toggle', {
      detail: { random: this.isRandom },
      bubbles: true,
      composed: true
    }));
  }

  randomSong() {
    return this.songs[Math.floor(Math.random() * this.songs.length)];
  }

  handleBeforeUnload(e) {
    if (this.wavesurfer && this.wavesurfer.isPlaying()) {
      e.preventDefault();
      e.returnValue = 'Audio is still playing. Are you sure you want to leave?';
      return e.returnValue;
    }
  }

  // Public API methods

  // Set songs list
  setSongs(songs) {
    this.songs = songs;
    this.currentSong = this.randomSong();
    if (this.wavesurfer) {
      this.wavesurfer.load(this.currentSong.url);
    }
  }

  // Get current song info
  getCurrentSong() {
    return this.currentSong;
  }

  // Get waveform element for tooltip attachment
  getWaveformElement() {
    return this.waveform;
  }

  // Get play button for tooltip attachment
  getPlayButton() {
    return this.playButton;
  }

  // Get random button for tooltip attachment
  getRandomButton() {
    return this.randomButton;
  }
}

customElements.define('media-player', MediaPlayer);
