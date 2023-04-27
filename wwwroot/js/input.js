const labels = document.querySelectorAll("label");
const LABEL_FOCUS = "bottom-[95%] left-[12%] text-sm z-10 text-secondary absolute font-extralight transition-all ease-in-out";
const LABEL = "text-base absolute bottom-[20%] left-[20%] z-10 font-extralight text-gray-600 transition-all ease-in-out";

labels.forEach(label => {
    const input = document.getElementById(label.attributes.getNamedItem("for").value);

    input.addEventListener("input", (e) => {
        if (input.value.length) label.className = "sr-only";
        else label.className = LABEL_FOCUS;
    });

    input.addEventListener("focus", (e) => {
        if (input.value.length) label.className = "sr-only";
        else label.className = LABEL_FOCUS;
    });

    input.addEventListener("focusout", (e) => {
        if (input.value.length) label.className = "sr-only";
        else label.className = LABEL;
    });
});
