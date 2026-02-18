var loader = document.getElementById("preloader");

if (window.location.hostname === "localhost") {
  loader.style.opacity = 0;
  loader.style.pointerEvents = "none";
}


if (loader.dataset.waitSong != undefined) {
  console.log("WAIT SONG")

  let loadedDocument = false;
  let loadedSong = false

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
} else {
  window.addEventListener("load", function() {
    loader.style.opacity = 0;
    loader.style.pointerEvents = "none";
  });
}

