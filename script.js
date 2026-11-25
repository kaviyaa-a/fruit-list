const fruitValue = document.querySelector(".fruit");
const btn = document.querySelector(".addBtn");
const container = document.querySelector(".container");
const error = document.getElementById("error");
const reset = document.querySelector(".btn-danger");
const all = document.getElementById("all");
const active = document.getElementById("active");
const done = document.getElementById("done");
const isNumber = /^-?\d+(\.\d+)?$/;

let fruit = [];
try {
    fruit = JSON.parse(localStorage.getItem("fruitsV2")) ?? [];
} catch (e) {
    fruit = [];
}

function saveFruits() {
    localStorage.setItem("fruitsV2", JSON.stringify(fruit));
}

function update() {
    const doneCount = fruit.filter((item) => item.done).length;
    all.textContent = `All (${fruit.length})`;
    done.textContent = `Done (${doneCount})`;
    active.textContent = `Active (${fruit.length - doneCount})`;
}

function renderFruits() {
    container.innerHTML = "";

    fruit.forEach((item) => {
        const row = document.createElement("div");
        row.className = "my-2";
        row.innerHTML = `
            <input type="checkbox" class="check" data-id="${item.id}">
            <h6 class="inputs"></h6>
            <button data-id="${item.id}" class="trash">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        const text = row.querySelector(".inputs");
        text.textContent = item.text;            // safe, innerHTML illa

        if (item.done) {
            row.querySelector(".check").checked = true;
            text.classList.add("text-decoration-line-through");
        }

        container.appendChild(row);
    });

    update();
}

function addFruit() {
    const input = fruitValue.value.trim();

    if (input === "" || isNumber.test(input)) {
        error.style.display = "block";
        error.textContent = "Enter a valid fruit name";
        return;
    }

    if (fruit.some((item) => item.text.toLowerCase() === input.toLowerCase())) {
        error.style.display = "block";
        error.textContent = "Fruit already added";
        return;
    }

    fruit.push({ id: Date.now(), text: input, done: false });
    saveFruits();
    fruitValue.value = "";
    renderFruits();
}

fruitValue.addEventListener("input", function () {
    error.style.display = "none";
});

btn.addEventListener("click", addFruit);

reset.addEventListener("click", function () {
    fruit = [];
    saveFruits();
    renderFruits();
});

container.addEventListener("click", function (event) {
    const trash = event.target.closest(".trash");
    if (!trash) return;

    const id = Number(trash.dataset.id);
    fruit = fruit.filter((item) => item.id !== id);
    saveFruits();
    renderFruits();
});

container.addEventListener("click", function (event) {
    const checkbox = event.target.closest(".check");
    if (!checkbox) return;

    const id = Number(checkbox.dataset.id);
    fruit = fruit.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
    );
    saveFruits();
    renderFruits();
});

renderFruits();