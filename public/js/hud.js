class HudBar extends HTMLElement {
  constructor() {
    super();
    this.left = this.getElementsByClassName("left")[0];
    this.center = this.getElementsByClassName("center")[0];
    this.right = this.getElementsByClassName("right")[0];
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.wrapper = document.createElement("section");
    this.wrapper.classList.add("hud-bar", "shadow", "hover-move")

    this.wrapper.appendChild(this.left);
    this.wrapper.appendChild(this.center);
    this.wrapper.appendChild(this.right);

    this.appendChild(this.wrapper)
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

class OnAirLight extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    this.notText = this.querySelector('#on-air-not');
    this.light = this.querySelector('#on-air-light');
    this.link = this.querySelector('#on-air-link');
    this.tooltip = this.querySelector("#on-air-tooltip");

    this.playingMessage = `<span class='emoji'>s</span> Listen Live! <span class='emoji'>s</span>`;
    this.offAirMessage = `<span class='emoji'>t</span> Download My Archives! <span class='emoji'>t</span>`

    this.playingMessage += `<div class="arrow" data-popper-arrow></div>`
    this.offAirMessage += `<div class="arrow" data-popper-arrow></div>`

    this.checkTime();
  }

  render() {
    this.innerHTML = `
      <span id="on-air-not"></span>
      <a id="no-style on-air-link" href="https://www.wmpg.org/show/sun2300/" target="_blank">
        <span id="on-air-light">On Air</span>
      </a>
      <my-tooltip data-for="#on-air-light" data-position="top" id="on-air-tooltip"></my-tooltip>
    `;
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

class MediaPlayer extends HTMLElement {
  constructor() {
    super();

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
    this.render();

    this.tooltip = this.querySelector("#waveform-tooltip");
    this.playButton = this.querySelector('.play-button');
    this.randomButton = this.querySelector('.random-button');
    this.waveform = this.querySelector('.waveform');

    this.playButton.addEventListener('click', () => this.togglePlay());
    this.randomButton.addEventListener('click', () => this.toggleRandom());

    this.initializeWaveSurfer();
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  render() {
    this.innerHTML = `
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

      <my-tooltip data-for=".waveform" data-position="top" id="waveform-tooltip"></my-tooltip>
    `;
  }

  disconnectedCallback() {
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

    this.wavesurfer.on('load', () => {
      this.playButton.setAttribute('disabled', 'true');
    });

    this.wavesurfer.on('ready', () => {
      this.dispatchEvent(new CustomEvent('song-load', {
        bubbles: true,
        composed: true,
      }));

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
}

customElements.define('media-player', MediaPlayer);
