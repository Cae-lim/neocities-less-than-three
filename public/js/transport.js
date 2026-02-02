const playPause = document.getElementById("play-button");
const playPauseTooltip = document
const randomButton = document.getElementById("random-button");
const waveform = document.getElementById("waveform");
const waveformTooltip = document.getElementById("waveform-tooltip");
const waveformTooltipContent = document.querySelector("#waveform-tooltip .tooltip-content");

const songs = [{
  url: 'https://file.garden/aX1-zQTMcUHpUpsD/neocities/malixus.wav',
  name: "Malixus"
}]

function randomSong() {
  return songs[Math.floor(Math.random() * songs.length)];
}

let currentSong = randomSong();
console.log(currentSong)

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
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

createTooltip(waveform, waveformTooltip);

playPause.addEventListener('click', (e) => {
  e.preventDefault();

  wavesurfer.playPause();
});

wavesurfer.on("play", () => {
  playPause.classList.remove("paused");

});

wavesurfer.on("pause", () => {
  playPause.classList.add("paused");
});

randomButton.addEventListener('click', (e) => {
  randomButton.classList.toggle('on')
})

wavesurfer.on('load', () => {
  playPause.setAttribute('disabled', true)
  playPause.classList.add("paused")
  waveformTooltipContent.innerText = `Loading "${currentSong.name}"`
})

wavesurfer.on('ready', () => {
  playPause.removeAttribute('disabled')
  waveformTooltipContent.innerText = `Playing "${currentSong.name}"`

  if (randomButton.classList.contains("on")) {
    wavesurfer.play()
  }
})

wavesurfer.on("finish", () => {
  if (randomButton.classList.contains("on")) {
    currentSong = randomSong();
    wavesurfer.load(currentSong.url);
  }
})

window.onbeforeunload = () => {
  if (wavesurfer.isPlaying()) {
    return 'prompt';
  }
}

wavesurfer.load(currentSong.url)
