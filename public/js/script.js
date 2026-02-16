var loader = document.getElementById("preloader");
let loadedDocument = false;
let loadedSong = false

window.addEventListener("load", function() {
  loadedDocument = true;

  if (loadedDocument && loadedSong) {
    loader.style.opacity = 0;
  }
});

window.addEventListener("song-load", function() {
  loadedSong = true;

  if (loadedDocument && loadedSong) {
    loader.style.opacity = 0;
  }
});
