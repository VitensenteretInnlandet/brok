// Input and output fields
const teller = document.querySelector("input#teller");
const nevner = document.querySelector("input#nevner");
const desimalSpan = document.querySelector("span#desimal");
const brok = {
    teller: Number(teller.value),
    nevner: Number(nevner.value)
};

// Buttons and checkboxes
const submitButton = document.querySelector("button#submit");
const forkortButton = document.querySelector("button#forkort");
const utvidButton = document.querySelector("button#utvid");
const sanntidCheckbox = document.querySelector("input#sanntid-check");
const desimalCheckbox = document.querySelector("input#desimal-check");
const prosentCheckbox = document.querySelector("input#prosent-check");

// Event listeners
[teller, nevner].forEach(input => {
    input.addEventListener("keyup", calculateFraction);
    input.addEventListener("input", calculateFraction);
});

[desimalCheckbox, prosentCheckbox, submitButton].forEach(input => {
    input.addEventListener("click", calculateFraction);
});

forkortButton.addEventListener("click", forkort);

// Checkbox: Kjør ting i sanntid
if (sanntidCheckbox.checked) { submitButton.style.visibility = "hidden" }
else { submitButton.style.visibility = "visible" }
sanntidCheckbox.addEventListener("click", function () {
    if (this.checked) {
        // submitButton.style.visibility = "hidden";
        submitButton.setAttribute("disabled", "");
        calculateFraction();
    }
    else {
        // submitButton.style.visibility = "visible";
        submitButton.removeAttribute("disabled")
    }
})

// Oppsett av animasjonslerrett
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - canvas.getBoundingClientRect("top").y - 50;

teller.focus()
teller.select()

function calculateFraction() {
    brok.teller = Number(teller.value);
    brok.nevner = Number(nevner.value);
    const decimal = brok.teller / brok.nevner;

    if (sanntidCheckbox.checked || event.code === "Enter" || event.type === "click") {
        displayFraction(brok.teller, brok.nevner);
        displayDivision();
    }

    function displayDivision() {
        const n = round(decimal, 4);
        // const p = (n * 100).toFixed(4);
        const p = round(n * 100, 4)
        if (prosentCheckbox.checked && desimalCheckbox.checked) {
            desimalSpan.innerHTML = ` = ${n} (${p}%)`;
        }
        else if (prosentCheckbox.checked && !desimalCheckbox.checked) {
            desimalSpan.innerHTML = ` = ${p}%`;
        }
        else if (!prosentCheckbox.checked && desimalCheckbox.checked) {
            desimalSpan.innerHTML = ` = ${n}`;
        }
        else {
            desimalSpan.innerHTML = "";
        }
    }
}

function displayFraction(teller, nevner) {
    let index = 0;

    if (teller <= nevner) {
        for (let i = 0; i < canvas.height; i += canvas.height / nevner) {
            if (index < teller) {
                c.fillStyle = "green";
            }
            else {
                c.fillStyle = "#500";
            }
            c.beginPath();
            c.fillRect(0, i, canvas.width, canvas.height / nevner + 1);
            c.closePath();
            c.fill();

            c.strokeStyle = "#ffffff55";
            c.moveTo(0, i);
            c.lineTo(canvas.width, i);
            c.stroke();
            index++;
        }
    }
    else {
        let index = 0;
        const divisions = Math.ceil(teller / nevner);

        for (let i = 0; i < canvas.height; i += canvas.height / (nevner + (teller - nevner))) {
            const fill = (Math.floor(index / nevner) + 1) * (80 / (divisions));
            c.fillStyle = `hsl(90, 50%, ${fill}%)`;

            c.beginPath();
            c.fillRect(0, i, canvas.width, canvas.height / nevner + 1);
            c.closePath();
            c.fill();

            c.strokeStyle = "#ffffff55";
            c.moveTo(0, i);
            c.lineTo(canvas.width, i);
            c.stroke();
            index++;
        }
    }
}

function forkort() {
    console.log(`${brok.teller}/${brok.nevner}`, "kunne blitt delt på:");
    forkortButton.classList.remove("error");
    const a = [];
    for (let i = 2; i <= brok.teller; i++) {
        a.push(i);
    }

    const t = a.filter(n => brok.teller % n === 0 && brok.nevner % n === 0);
    console.log(t);
    const storst = Math.max(...t);

    if (t.length >= 1) {
        forkortButton.classList.add("success");
        setTimeout(() => forkortButton.classList.remove("success"), 1000);

        teller.value = brok.teller / storst;
        nevner.value = brok.nevner / storst;

        brok.teller = brok.teller / storst;
        brok.nevner = brok.nevner / storst;

        calculateFraction();
        displayFraction(brok.teller, brok.nevner);
    }
    else {
        forkortButton.classList.add("error");
        setTimeout(() => forkortButton.classList.remove("error"), 1000);
    }
}

function utvid() {
    const mult = [];
    const tellere = [];
    const nevnere = [];

    for (let i = 2; i < 100; i++) {
        mult.push(i);

    }
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}