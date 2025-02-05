const playingSpan = document.getElementById("playing")
const subtitleSpan = document.getElementById("subtitle")
const cellsElement = document.querySelectorAll(`button.cell`)

const players = ["blue", "red"]
const playersSeed = ["gold_nugget", "iron_nugget"]
const scores = [0, 0]
const cells = Array(12)

let player = 0
let gameFinished = false
let movedSeeds = 0
let moves = 0

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

/**
 * Initialization function
 */
function init() {
    player = Math.floor(Math.random() > 0.5 % 2)
    setupButtonEvent()
    initSeeds()
    updateCells()
    updatePlaying()
}

/**
 * Add event listeners for buttons
 */
function setupButtonEvent() {
    cellsElement.forEach((cell, i) => {
        cell.addEventListener("click", () => {
            play(parseInt(cell.id))
        })
    })
}

/**
 * Play cell index
 * @param {Number} index 
 */
function play(index) {
    let seeds = cells[index]
    if (seeds.length == 0 || gameFinished) {
        return
    }
    moves++
    cells[index] = []
    let x = index
    let len = seeds.length
    movedSeeds += len
    while (seeds.length) {
        x--
        if (x < 0) {
            x = 11
        }
        let seed = seeds.pop()
        addSeed(x, seed)
        cells[x].push(seed)
    }
    for (let i = 0; i < len; i++) {
        if (cells[x].length > 1 && cells[x].length < 4 && !(x >= 6 * player && x < 6 * (player + 1)) ) {
            movedSeeds = 0
            moves = 0
            scores[player] += cells[x].length
            cells[x].forEach(seed => {
                seed.remove()
            })
            cells[x] = []
            updateScore()
        } else {
            if (!(cells[x].length > 1 && cells[x].length < 4)) {
                break;
            }
        }
        x++
        if (x > 11) {
            x = 0
        }
    }

    updateCells()

    if (moves >= 10 && movedSeeds/moves < 3) {
        showWinner()
        return
    }

    player = (player + 1) % 2
    updatePlaying()
}

/**
 * Disable cells depending of the current player
 */
function disableSideCells() {
    Array.from(document.querySelectorAll(`button.cell.${players[(player + 1) % 2]}`)).forEach((cell) => {
        cell.setAttribute("disabled", true)
    })
    Array.from(document.querySelectorAll(`button.cell.${players[player]}`)).forEach((cell) => {
        cell.removeAttribute("disabled")
    })
}

/**
 * Update displayed score
 */
function updateScore() {
    document.querySelector(".score.blue").textContent = scores[0]
    document.querySelector(".score.red").textContent = scores[1]
}

/**
 * Update the playing states, check if no more seeds in playing cells
 */
function updatePlaying() {
    let remainingSeeds = cells.slice(player*6,(player+1)*6).map(c => c.length).reduce((a, c) => a + c)
    if (remainingSeeds <= 0) {
        showWinner(players[(player + 1) % 2])
        return
    }
    updatePlayingText()
    disableSideCells()
}

/**
 * Update the playing span with the current player
 */
function updatePlayingText() {
    playingSpan.textContent = players[player]
    playingSpan.className = `${players[player]}`
}

/**
 * Update displayed numbers in cells
 */
function updateCells() {
    cellsElement.forEach((cell, i) => {
        cell.querySelector("span").textContent = cells[parseInt(cell.id)].length
    })
}

/**
 * Init seeds element in cells with texture for each players
 */
function initSeeds() {
    for (let i = 0; i < cells.length; i++) {
        cells[i] = []
        for (let j = 0; j < 4; j++) {
            let texture = i < 6 ? playersSeed[0] : playersSeed[1]
            let seed = createSeed(texture)
            addSeed(i, seed)
            cells[i].push(seed)
        }
    }
}

/**
 * Create an element with random position
 * @param {Stirng} texture 
 */
function createSeed(texture) {
    let top = Math.random() * 60 + 5
    let left = Math.random() * 60 + 5
    let rot = Math.random() * 90 - 45

    let seed = document.createElement("img")
    seed.src = `https://assets.mcasset.cloud/1.21.4/assets/minecraft/textures/item/${texture}.png`
    seed.classList.add("seed")
    seed.style = `--top: ${top}px; --left: ${left}px; --rot: ${rot}deg;`

    return seed
}

/**
 * Add seed element to cell by ID
 * @param {Number} id 
 * @param {HTMLElement} seed 
 */
function addSeed(id, seed) {
    document.getElementById(id).appendChild(seed)
}

/**
 * Select and show the winner
 */
function showWinner() {
    if (scores[0] > scores[1]) {
        showWinnerColor(players[0])
    } else if (scores[0] < scores[1]) {
        showWinnerColor(players[1])
    } else {
        showWinnerColor("tie")
    }
}

/**
 * Show the winner by color
 * @param {String} color 
 */
function showWinnerColor(color) {
    subtitleSpan.querySelector(".prefix").textContent = "The winner is: "
    playingSpan.textContent = color
    playingSpan.className = `${color}`

    Array.from(document.querySelectorAll(`button.cell`)).forEach((cell) => {
        cell.removeAttribute("disabled")
    })

    gameFinished = true
}

window.onload = init