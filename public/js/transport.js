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

document.addEventListener("play-toggle", () => {
  wavesurfer.playPause();
})

wavesurfer.on('load', () => {
  playPause.setAttribute('disabled', true)
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
