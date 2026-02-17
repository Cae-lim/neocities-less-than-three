const messages = [
  "Shoot Fascists",
  "Melt Ice",
  "Be Right Back. I'm Estrogen Maxing",
  "Smoke Weed, Chop Breakbeats",
  "Free Palestine",
  "Free Sudan"
]


const messageElement = document.getElementById("header-message");
const selected = messages[Math.floor(Math.random() * messages.length)]
messageElement.innerHTML =
  `<h1>${selected}</h1>
  <subtitle>${selected}</subtitle>`
