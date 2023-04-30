/**
 * @param {string} htmlString the html content to display inside modal
 * @returns {function} openModal to open modal and display the html content inside modal
 */
var modal = (htmlString, cb) => {
    const target = document.createElement("div");
    target.className = "flex flex-col w-[300px] h-[300px] justify-center items-center bg-white shadow-xl rounded-md";
    target.innerHTML = htmlString;

    const modal = document.createElement("div");
    modal.className = "flex flex-col w-full h-full fixed top-0 left-0 justify-center items-center";
    modal.appendChild(target);

    const body = document.querySelector("body");
    const html = document.querySelector("html");
    let isOpen = false;
    let isTryToOpening = true;

    document.addEventListener('click', (e) => {
        if (isTryToOpening) {
            isTryToOpening = false;
            return;
        };

        if (!e.composedPath().includes(target) && isOpen) {
            isOpen = false;
            html.removeChild(modal);
            body.removeAttribute("class");
        }
    });

    return function openModal() {
        body.className = "blur-sm";
        html.appendChild(modal);
        isOpen = true;
        isTryToOpening = true;
        cb()
    }
}
