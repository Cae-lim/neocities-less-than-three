
var loader = document.getElementById("preloader");
let loadedDocument = false;
let loadedSong = false

if (window.location.hostname === "localhost") {
  loader.style.opacity = 0;
  loader.style.pointerEvents = "none";
}
window.addEventListener("load", function() {
  loadedDocument = true;

  if (loadedDocument && loadedSong) {
    loader.style.opacity = 0;
    loader.style.pointerEvents = "none";
  }
});

window.addEventListener("song-load", function() {
  loadedSong = true;

  if (loadedDocument && loadedSong) {
    loader.style.opacity = 0;
    loader.style.pointerEvents = "none";
  }
});
