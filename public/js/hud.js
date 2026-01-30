const sign = document.getElementById("on-air-sign");
const notText = document.getElementById("on-air-not");
const link = document.getElementById("on-air-link");
const light = document.getElementById("on-air-light")
const tooltipText = document.querySelector("#on-air-tooltip .tooltip-content");
const tooltip = document.getElementById("on-air-tooltip");

// stolen <3
// @ts-ignore
Date.prototype.getWeek = function() {
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  //@ts-ignore
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

function checkTime() {
  // I do even weeks :)
  const today = new Date();

  const isSunday = today.getDay() === 0;
  const isMonday = today.getDay() == 1;
  // @ts-ignore
  const rightWeek = today.getWeek() % 2 !== 0;
  const rightTimeSunday = today.getHours() === 23;
  const rightTimeMonday = today.getHours() <= 1;

  if (rightWeek &&
    (
      (isSunday && rightTimeSunday) ||
      (isMonday && rightTimeMonday)
    )
  ) {
    notText.innerText = "";
    sign.classList.add("on");
    tooltipText.innerHTML = "<span class='emoji'>s</span> Listen Live! <span class='emoji'>s</span>"
  } else {
    notText.innerText = "(not)";
    sign.classList.remove("on")
    tooltipText.innerHTML = "<span class='emoji'>t</span> Download My Archives! <span class='emoji'>t</span>"
  }

  setTimeout(checkTime, 60000);
}

checkTime();

createTooltip(light, tooltip)

const neocitiesImage = document.querySelector("#neocities-logo img");
const neocitiesTooltip = document.getElementById("neocities-tooltip");

createTooltip(neocitiesImage, neocitiesTooltip)
