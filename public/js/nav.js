const currentPage = window.location.href;
const nav = document.getElementById("site-links");
for (const child of nav.children) {
  if (currentPage == child.href) {
    child.classList.add("active")
  }
}

const radio = document.getElementById("nav-radio")
const radioTooltip = document.getElementById("nav-radio-tooltip")
const github = document.getElementById("nav-github");
const githubTooltip = document.getElementById("nav-github-tooltip")
const tumblr = document.getElementById("nav-tumblr");
const tumblrTooltip = document.getElementById("nav-tumblr-tooltip")
const reaper = document.getElementById("nav-reaper")
const reaperTooltip = document.getElementById("nav-reaper-tooltip")
const sdaw = document.getElementById("nav-sdaw")
const sdawTooltip = document.getElementById("nav-sdaw-tooltip")
const strudel = document.getElementById("nav-strudel")
const strudelTooltip = document.getElementById("nav-strudel-tooltip")
const emojis = document.getElementById("nav-emojis")
const emojisTooltip = document.getElementById("nav-emojis-tooltip")

createTooltip(radio, radioTooltip, "right");
createTooltip(github, githubTooltip, "right");
createTooltip(tumblr, tumblrTooltip, "right");
createTooltip(sdaw, sdawTooltip, "right");
createTooltip(strudel, strudelTooltip, "right");
createTooltip(emojis, emojisTooltip, "right");
createTooltip(reaper, reaperTooltip, "right")
