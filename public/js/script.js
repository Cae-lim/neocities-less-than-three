async function loadTemplate(file) {
  const parser = new DOMParser()
  const response = await fetch(file);
  const html = await response.text();
  const template = parser.parseFromString(html, "text/html").querySelector("template");
  return template;
}
