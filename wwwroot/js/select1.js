  const input = document.getElementById("select");
  const target = document.getElementById("select-target");
  const datalist = document.querySelector("datalist");
  const label = document.getElementById("select-label");

  input.addEventListener("focus", (e) => datalist.style.display = 'block');

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(target)) datalist.style.display = 'none';
  });

  input.addEventListener("input", (e) => {
    const text = input.value.toLowerCase();

    for (let option of datalist.options) {
      const optionValue = option.value.toLowerCase();
      if (optionValue.startsWith(text)) option.style.display = "block";
      else option.style.display = "none";
    }

  });

  const ChoseOption = (e) => {
    input.value = e.value;
    datalist.style.display = 'none';
    label.className = "sr-only";
  }

