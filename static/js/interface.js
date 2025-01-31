const interface = document.getElementById("interface")

const registerUsername = document.getElementById("register-username")
const registerPassword = document.getElementById("register-password")
const registerResult = document.getElementById("register-result")

const loginUsername = document.getElementById("login-username")
const loginPassword = document.getElementById("login-password")
const loginResult = document.getElementById("login-result")

const loginOption = document.getElementById("login-option")
const logoutOption = document.getElementById("logout-option")

const multiplayerBtn = document.getElementById("multiplayer-btn")
const gamesContainer = document.getElementById("games-container")

let eventHandlers = {}

function addEventHandler(id, callback) {
    eventHandlers[id] = callback
}

function playSingleplayer() {
    interface.style.display = "none"
}

function showPage(id) {
    document.querySelector(".page.show").classList.remove("show")
    document.getElementById(`page-${id}`).classList.add("show")
    eventHandlers[id]()
}

async function register() {
    let username = registerUsername.value
    let password = registerPassword.value 

    let data = await POST("/api/auth/register", {
        username: username,
        password: password
    })
    registerResult.textContent = data.message
    await loginOptionsToggle()
}

async function login() {
    let username = loginUsername.value
    let password = loginPassword.value 

    let data = await POST("/api/auth/login", {
        username: username,
        password: password
    })
    loginResult.textContent = data.message
    await loginOptionsToggle()
}

async function logout() {
    await POST("/api/auth/logout")
    await loginOptionsToggle()
}

async function loginOptionsToggle() {
    if (await getUser()) {
        logoutOption.classList.remove("hidden")
        loginOption.classList.add("hidden")
        multiplayerBtn.removeAttribute("disabled")
    } else {
        loginOption.classList.remove("hidden")
        logoutOption.classList.add("hidden")
        multiplayerBtn.setAttribute("disabled", true)
    }
}

async function loadAvalableGames() {
    let games = await GET("/api/games/available")

    games.forEach(game => {
        gamesContainer.innerHTML += `<div>
            <span class="text">${game.name}</span>
            <button class="btn square ml" onclick="connect(${game.id})">></button>
        </div>`
    })
}

async function createGame() {
    
}

addEventHandler("multiplayer", loadAvalableGames)

window.addEventListener("load", loginOptionsToggle)