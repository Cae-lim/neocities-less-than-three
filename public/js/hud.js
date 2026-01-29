const sign = document.getElementById("on-air-sign");
const notText = document.getElementById("on-air-not");
const link = document.getElementById("on-air-link");

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
    link.classList.remove("disabled")
  } else {
    notText.innerText = "(not)";
    sign.classList.remove("on")
    link.classList.add("disabled")
  }

  setTimeout(checkTime, 60000);
}

checkTime();
