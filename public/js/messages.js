const messages = [
  "Shoot Fascists",
  "Melt Ice",
  "Be Right Back. I'm Estrogen Maxxing",
  "Smoke Weed, Chop Breakbeats"
]


const messageElement = document.getElementById("header-message");
const selected = messages[Math.floor(Math.random() * messages.length)]
messageElement.innerHTML =
  `<h1>${selected}</h1>
  <subtitle>${selected}</subtitle>`
