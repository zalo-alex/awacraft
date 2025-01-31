const interface = document.getElementById("interface")

const registerUsername = document.getElementById("register-username")
const registerPassword = document.getElementById("register-password")
const registerResult = document.getElementById("register-result")

const loginUsername = document.getElementById("login-username")
const loginPassword = document.getElementById("login-password")
const loginResult = document.getElementById("login-result")

const loginOption = document.getElementById("login-option")
const logoutOption = document.getElementById("logout-option")

function playSingleplayer() {
    interface.style.display = "none"
}

function showPage(id) {
    document.querySelector(".page.show").classList.remove("show")
    document.getElementById(`page-${id}`).classList.add("show")
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
    } else {
        loginOption.classList.remove("hidden")
        logoutOption.classList.add("hidden")
    }
}

window.addEventListener("load", loginOptionsToggle)