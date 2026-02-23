const copyButton = document.getElementById("copy-button");
const textArea = document.getElementById("blinkie-textarea")
const result = document.getElementById("blinkie-result")

copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(textArea.value);
  copyButton.innerText = "Copied!"
})

textArea.addEventListener('input', updateResult)

function updateResult() {
  result.innerHTML = textArea.value;
  copyButton.innerText = "Copy"
}

updateResult()
