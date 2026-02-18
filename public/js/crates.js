class Song {
  constructor(title, artist, link, radioEdit = false) {
    this.title = title;
    this.artist = artist;
    this.link = link;
    this.radioEdit = radioEdit;
  }

  render() {
    const li = document.createElement("li")
    li.innerHTML = `
      <a href="${this.link}" target="_blank">
        <span class="bold">${this.title} - ${this.artist}</span> ${this.radioEdit ? "(Played a radio edit I made)" : ""}
      </a>
    `

    return li;
  }
}

function loadSongs(crate) {
  const output = [];
  for (let i = 0; i < crate.length; i++) {
    const currentSong = crate[i];
    output.push(
      new Song(
        currentSong["Track name"],
        currentSong["Artist name"],
        `https://tidal.com/track/${currentSong["Tidal - id"]}/u`,
        currentSong["Radio edit"] != undefined && currentSong["Radio edit"] != false
      )
    )
  }

  return output;
}

const planetariumList = document.getElementById("fridaze-planetarium");
const planetariumSongs = loadSongs(planetariumCrate);

for (let i = 0; i < planetariumSongs.length; i++) {
  planetariumList.appendChild(planetariumSongs[i].render())
}

