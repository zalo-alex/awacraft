const playingSpan = document.getElementById("playing")
const players = ["blue", "red"]
const scores = [0, 0]
const cells = Array(12).fill(4)
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
    updateCells()
    setupButtonEvent()
    addSeeds()
}

function setupButtonEvent() {
    cellsElement.forEach((cell, i) => {
        cell.addEventListener("click", () => {
            play(parseInt(cell.id))
        })
    })
}

function play(index) {
    let a = cells[index]
    if (a == 0) {
        return
    }
    cells[index] = 0
    let x = index
    for (let i = 1; i <= a; i++) {
        x--
        if (x < 0) {
            x = 11
        }
        cells[x] += 1
        if (cells[x] > 1 && cells[x] < 4 && !(x >= 6 * player && x < 6 * (player + 1)) ) {
            scores[player] += cells[x]
            cells[x] = 0
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
        cell.querySelector("span").textContent = cells[parseInt(cell.id)]
    })
}

function addSeeds() {
    document.querySelectorAll(".cell").forEach((cell) => {
        for (let i = 0; i < 15; i++) {
            let top = Math.random() * 60 + 5
            let left = Math.random() * 60 + 5
            let rot = Math.random() * 90 - 45
            let texture = textures[Math.floor(Math.random() * textures.length)]
            cell.innerHTML += `<img src="https://assets.mcasset.cloud/1.21.4/assets/minecraft/textures/item/${texture}.png" class="seed" style="--top: ${top}px; --left: ${left}px; --rot: ${rot}deg;">`
        }
    })
}

window.onload = init