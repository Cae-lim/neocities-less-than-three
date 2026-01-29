const currentPage = window.location.href;
const nav = document.getElementById("nav");
for(const child of nav.children) {
  if(currentPage == child.href) {
    child.classList.add("active")
  }
}