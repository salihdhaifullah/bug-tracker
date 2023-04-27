const input = document.getElementById("browsers");
const target = document.getElementById("select-target");
const browsers = document.querySelector("datalist");
const options = document.querySelectorAll("option");
const label = document.getElementById("browsers-label");


const ChoseOption = (e) => {
    input.value = e.value;
    browsers.style.display = 'none';
    label.className = "sr-only";
}


input.addEventListener("focus", (e) => browsers.style.display = 'block');

document.addEventListener('click', (e) => {
    const withinBoundaries = e.composedPath().includes(target)
    if (!withinBoundaries) browsers.style.display = 'none';
});

input.addEventListener("input", (e) => {
  const text = input.value.toLowerCase();

  for (let option of browsers.options) {
    const optionValue = option.value.toLowerCase();
    if (optionValue.startsWith(text)) option.style.display = "block";
    else option.style.display = "none";
  }

});
