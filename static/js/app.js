const playingSpan = document.getElementById("playing")
const players = ["blue", "red"]
const scores = [0, 0]
const cells = Array(12)
const cellsElement = document.querySelectorAll(`button.cell`)

let player = 0

let textures = [
    "wheat_seeds",
    "beetroot_seeds",
    "pumpkin_seeds",
    "melon_seeds",

    "gold_ingot",
    "iron_ingot",
    "diamond",
    "emerald"
]

function init() {
    player = Math.floor(Math.random() > 0.5 % 2)
    updatePlaying()
    setupButtonEvent()
    initSeeds()
    updateCells()
}

function setupButtonEvent() {
    cellsElement.forEach((cell, i) => {
        cell.addEventListener("click", () => {
            play(parseInt(cell.id))
        })
    })
}

function play(index) {
    let seeds = cells[index]
    if (seeds.length == 0) {
        return
    }
    cells[index] = []
    let x = index
    while (seeds.length) {
        x--
        if (x < 0) {
            x = 11
        }
        let seed = seeds.pop()
        addSeed(x, seed)
        cells[x].push(seed)
        if (cells[x].length > 1 && cells[x].length < 4 && !(x >= 6 * player && x < 6 * (player + 1)) ) {
            scores[player] += cells[x].length
            cells[x].forEach(seed => {
                seed.remove()
            })
            cells[x] = []
            updateScore()
        }
    }
    updateCells()
    player = (player + 1) % 2
    updatePlaying()
}

function disableCells(disabled) {
    Array.from(document.querySelectorAll("button.cell")).forEach((cell) => {
        if (disabled) {
            cell.setAttribute("disabled", true)
        } else {
            cell.removeAttribute("disabled")
        }
    })
}

function disableSideCells() {
    Array.from(document.querySelectorAll(`button.cell.${players[(player + 1) % 2]}`)).forEach((cell) => {
        cell.setAttribute("disabled", true)
    })
    Array.from(document.querySelectorAll(`button.cell.${players[player]}`)).forEach((cell) => {
        cell.removeAttribute("disabled")
    })
}

function updateScore() {
    document.querySelector(".score.blue").textContent = scores[0]
    document.querySelector(".score.red").textContent = scores[1]
}

function updatePlaying() {
    playingSpan.textContent = players[player]
    playingSpan.className = `${players[player]}`
    disableSideCells()
    //disableCells(!playing)
}

function updateCells() {
    cellsElement.forEach((cell, i) => {
        cell.querySelector("span").textContent = cells[parseInt(cell.id)].length
    })
}

function initSeeds() {
    for (let i = 0; i < cells.length; i++) {
        cells[i] = []
        for (let j = 0; j < 4; j++) {
            let seed = createSeed()
            addSeed(i, seed)
            cells[i].push(seed)
        }
    }
}

function createSeed() {
    let top = Math.random() * 60 + 5
    let left = Math.random() * 60 + 5
    let rot = Math.random() * 90 - 45
    let texture = textures[Math.floor(Math.random() * textures.length)]

    let seed = document.createElement("img")
    seed.src = `https://assets.mcasset.cloud/1.21.4/assets/minecraft/textures/item/${texture}.png`
    seed.classList.add("seed")
    seed.style = `--top: ${top}px; --left: ${left}px; --rot: ${rot}deg;`

    return seed
}

function addSeed(id, seed) {
    document.getElementById(`${id}`).appendChild(seed)
}

window.onload = init